import { CheckoutAddress } from "@/app/contexts/CartContext";

type CheckoutAddressField = keyof CheckoutAddress;

export type CheckoutAddressErrors = Partial<Record<CheckoutAddressField, string>>;

const REQUIRED_CHECKOUT_FIELDS: ReadonlySet<CheckoutAddressField> = new Set([
  "firstName",
  "lastName",
  "address1",
  "city",
  "postalCode",
  "country",
]);

const NAME_DISALLOWED = /[^A-Za-zÀ-ÖØ-öø-ÿ' -]/gu;
const ADDRESS_LINE_DISALLOWED = /[^0-9A-Za-zÀ-ÖØ-öø-ÿ.,'\-\s]/gu;
const CITY_DISALLOWED = /[^A-Za-zÀ-ÖØ-öø-ÿ'\-\s]/gu;
const COUNTRY_DISALLOWED = /[^A-Za-zÀ-ÖØ-öø-ÿ'\-\s]/gu;
const COMPANY_DISALLOWED = /[^0-9A-Za-zÀ-ÖØ-öø-ÿ.,'&()\-\s]/gu;
const MESSAGE_DISALLOWED = /[^0-9A-Za-zÀ-ÖØ-öø-ÿ.,!?;:'"()@#&€$%+\-=_\s]/gu;
const POSTAL_CODE_ALLOWED = /[^0-9A-Za-z\s\-]/g;
const PHONE_DISALLOWED = /[^0-9+().\s\-]/g;

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/u;
const ADDRESS_LINE_REGEX = /^[0-9A-Za-zÀ-ÖØ-öø-ÿ.,'\-\s]{5,100}$/u;
const OPTIONAL_ADDRESS_LINE_REGEX = /^[0-9A-Za-zÀ-ÖØ-öø-ÿ.,'\-\s]{0,100}$/u;
const CITY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]{2,80}$/u;
const COUNTRY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]{2,80}$/u;
const COMPANY_REGEX = /^[0-9A-Za-zÀ-ÖØ-öø-ÿ.,'&()\-\s]{2,80}$/u;
const PHONE_REGEX = /^\+?[0-9\s().\-]{6,20}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const POSTAL_CODE_REGEX = /^[0-9A-Za-z][0-9A-Za-z\s\-]{3,9}$/;

const trimAndCollapseSpaces = (value: string) => value.replace(/\s+/g, " ").trim();

export const sanitizeName = (value: string) =>
  trimAndCollapseSpaces(value.normalize("NFKC").replace(NAME_DISALLOWED, ""));

export const isValidName = (value: string) => NAME_REGEX.test(value);

export const sanitizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value);

export const sanitizePhone = (value: string) => {
  const normalized = value.normalize("NFKC").replace(PHONE_DISALLOWED, "");
  const collapsed = trimAndCollapseSpaces(normalized);
  if (!collapsed) {
    return "";
  }

  const hasLeadingPlus = collapsed.startsWith("+");
  const withoutPluses = collapsed.replace(/\+/g, "");
  return hasLeadingPlus ? `+${withoutPluses}` : withoutPluses;
};

export const isValidPhone = (value: string) => PHONE_REGEX.test(value);

export const sanitizeMessage = (value: string) =>
  trimAndCollapseSpaces(
    value.normalize("NFKC").replace(/[<>]/g, "").replace(MESSAGE_DISALLOWED, "")
  );

export const isValidMessage = (value: string) => {
  const length = value.length;
  return length >= 10 && length <= 1000;
};

const sanitizeAddressLine = (value: string, optional = false) => {
  const sanitized = trimAndCollapseSpaces(
    value.normalize("NFKC").replace(ADDRESS_LINE_DISALLOWED, "")
  );
  if (optional && sanitized.length === 0) {
    return "";
  }
  return sanitized.slice(0, 100);
};

const sanitizeCity = (value: string) =>
  trimAndCollapseSpaces(value.normalize("NFKC").replace(CITY_DISALLOWED, ""));

const sanitizeCountry = (value: string) =>
  trimAndCollapseSpaces(value.normalize("NFKC").replace(COUNTRY_DISALLOWED, ""));

const sanitizeCompany = (value: string) =>
  trimAndCollapseSpaces(value.normalize("NFKC").replace(COMPANY_DISALLOWED, ""));

const sanitizePostalCode = (value: string) => {
  const sanitized = trimAndCollapseSpaces(
    value.normalize("NFKC").replace(POSTAL_CODE_ALLOWED, "")
  ).toUpperCase();
  return sanitized.slice(0, 10);
};

export const sanitizeCheckoutField = (
  field: CheckoutAddressField,
  value: string
): string => {
  switch (field) {
    case "firstName":
    case "lastName":
      return sanitizeName(value);
    case "company":
      return sanitizeCompany(value);
    case "address1":
      return sanitizeAddressLine(value);
    case "address2":
      return sanitizeAddressLine(value, true);
    case "city":
      return sanitizeCity(value);
    case "postalCode":
      return sanitizePostalCode(value);
    case "country":
      return sanitizeCountry(value);
    case "phone":
      return sanitizePhone(value);
    case "email":
      return sanitizeEmail(value);
    default:
      return trimAndCollapseSpaces(value);
  }
};

export const isCheckoutFieldRequired = (field: CheckoutAddressField) =>
  REQUIRED_CHECKOUT_FIELDS.has(field);

export const validateCheckoutField = (
  field: CheckoutAddressField,
  rawValue: string,
  options?: { required?: boolean }
): string | null => {
  const required = options?.required ?? isCheckoutFieldRequired(field);
  const value = rawValue.trim();

  if (!value) {
    return required ? "Ce champ est requis." : null;
  }

  switch (field) {
    case "firstName":
    case "lastName":
      return isValidName(value) ? null : "Veuillez saisir un nom valide.";
    case "company":
      return value ? (COMPANY_REGEX.test(value) ? null : "Format de société invalide.") : null;
    case "address1":
      return ADDRESS_LINE_REGEX.test(value)
        ? null
        : "Veuillez saisir une adresse valide.";
    case "address2":
      return OPTIONAL_ADDRESS_LINE_REGEX.test(value)
        ? null
        : "Veuillez saisir une adresse valide.";
    case "city":
      return CITY_REGEX.test(value) ? null : "Ville invalide.";
    case "postalCode":
      return POSTAL_CODE_REGEX.test(value) ? null : "Code postal invalide.";
    case "country":
      return COUNTRY_REGEX.test(value) ? null : "Pays invalide.";
    case "phone":
      return value ? (isValidPhone(value) ? null : "Téléphone invalide.") : null;
    case "email":
      return value ? (isValidEmail(value) ? null : "Email invalide.") : null;
    default:
      return null;
  }
};

export const validateCheckoutAddress = (
  address: CheckoutAddress,
  options?: { requireEmail?: boolean }
): CheckoutAddressErrors => {
  const errors: CheckoutAddressErrors = {};

  (Object.keys(address) as CheckoutAddressField[]).forEach((field) => {
    const error = validateCheckoutField(field, address[field], {
      required:
        options?.requireEmail && field === "email"
          ? true
          : isCheckoutFieldRequired(field),
    });
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const hasCheckoutErrors = (errors: CheckoutAddressErrors) =>
  Object.values(errors).some((value) => Boolean(value));
