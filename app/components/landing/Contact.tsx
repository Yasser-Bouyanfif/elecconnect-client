"use client";
import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactField = keyof ContactFormData;

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' \-]{2,60}$/;
const PHONE_REGEX = /^(?:\+33 ?|0)[1-9](?:[ .\-]?\d{2}){4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 1000;

const sanitizeFieldValue = (field: ContactField, value: string) => {
  const normalized = value.normalize("NFKC");

  switch (field) {
    case "name":
      return normalized
        .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' \-]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .slice(0, 60);
    case "phone":
      return normalized
        .replace(/[^0-9+ ]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 20);
    case "email":
      return normalized
        .replace(/[\s<>"'()]/g, "")
        .toLowerCase()
        .slice(0, 254);
    case "message":
      return normalized
        .replace(/[<>]/g, "")
        .replace(/\r/g, "")
        .slice(0, MESSAGE_MAX_LENGTH)
        .trim();
    default:
      return normalized.trim();
  }
};

const validateFormData = (data: ContactFormData) => {
  const sanitized: ContactFormData = {
    name: sanitizeFieldValue("name", data.name),
    email: sanitizeFieldValue("email", data.email),
    phone: sanitizeFieldValue("phone", data.phone),
    message: sanitizeFieldValue("message", data.message),
  };

  if (!NAME_REGEX.test(sanitized.name)) {
    return {
      valid: false,
      sanitized,
      error:
        "Merci d'indiquer un nom complet valide (lettres, espaces, apostrophes).",
    } as const;
  }

  if (!PHONE_REGEX.test(sanitized.phone)) {
    return {
      valid: false,
      sanitized,
      error:
        "Merci de fournir un numéro de téléphone français valide (ex. 06 12 34 56 78).",
    } as const;
  }

  if (!EMAIL_REGEX.test(sanitized.email)) {
    return {
      valid: false,
      sanitized,
      error: "Merci de fournir une adresse email valide.",
    } as const;
  }

  if (sanitized.message.length < MESSAGE_MIN_LENGTH) {
    return {
      valid: false,
      sanitized,
      error: "Votre message doit contenir au moins 10 caractères.",
    } as const;
  }

  return { valid: true, sanitized } as const;
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const validation = validateFormData(formData);
    setFormData(validation.sanitized);

    if (!validation.valid) {
      setStatus("error");
      setErrorMessage(validation.error);
      return;
    }

    setStatus("loading");

    try {
      const normalizedPhone = validation.sanitized.phone.replace(/\s+/g, "");
      const response = await fetch("/api/resend/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: validation.sanitized.name,
          phone: normalizedPhone,
          email: validation.sanitized.email,
          content: validation.sanitized.message,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        setErrorMessage(
          typeof errorBody?.error === "string"
            ? errorBody.error
            : "Une erreur est survenue lors de l'envoi du message."
        );
        setStatus("error");
        return;
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatus("success");
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire de contact", error);
      setErrorMessage(
        "Impossible d'envoyer votre demande pour le moment. Veuillez réessayer plus tard."
      );
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!name || !(name in formData)) {
      return;
    }

    const fieldName = name as ContactField;
    const sanitizedValue = sanitizeFieldValue(fieldName, value);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: sanitizedValue,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Contactez-nous
            </h2>
            <p className="text-slate-600 mb-8">
              Obtenez votre devis gratuit sous 8h pour votre projet d'installation.
            </p>

            <div className="space-y-4">
              {/* Téléphone */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <a href="tel:+33698657780" className="block font-medium text-slate-800 hover:text-emerald-600 transition-colors">
                    +33 6 98 65 77 80
                  </a>
                  <a href="tel:+33422918291" className="block font-medium text-slate-800 hover:text-emerald-600 transition-colors">
                    +33 4 22 91 82 91
                  </a>
                  <div className="text-sm font-bold text-emerald-500 animate-[heartbeat_2s_ease-in-out_infinite]">
                    24/24
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <a href="mailto:contact@elecconnect.fr" className="block font-medium text-slate-800 hover:text-emerald-600 transition-colors">
                    contact@elecconnect.fr
                  </a>
                  <div className="text-sm text-slate-500">Réponse sous 8h</div>
                </div>
              </div>

              {/* Localisation */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Provence-Alpes-Côte d'Azur</div>
                  <div className="font-medium text-slate-800 mt-1">Île-de-France</div>
                  <div className="text-sm text-slate-500">Zones d'intervention</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom complet"
                  autoComplete="name"
                  required
                  maxLength={60}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  autoComplete="tel"
                  required
                  maxLength={20}
                  inputMode="tel"
                  pattern="^(?:\\+33 ?|0)[1-9](?:[ .\\-]?\\d{2}){4}$"
                  title="Numéro français attendu, ex. 06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                maxLength={254}
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />

              <textarea
                name="message"
                placeholder="Décrivez votre projet..."
                required
                rows={4}
                minLength={MESSAGE_MIN_LENGTH}
                maxLength={MESSAGE_MAX_LENGTH}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white"
              ></textarea>

              <button
                type="submit"
                className="btn btn-success btn-block text-white hover:text-white flex items-center justify-center gap-2"
                disabled={status === "loading"}
              >
                <span>{status === "loading" ? "Envoi en cours..." : "Envoyer ma demande"}</span>
                <Send className="w-4 h-4" />
              </button>
              {status === "success" && (
                <p className="text-sm text-emerald-600 text-center">
                  Votre message a bien été envoyé. Nous vous répondrons sous 8h.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500 text-center">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Animation heartbeat */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.08); }
          50% { transform: scale(0.96); }
          75% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
}
