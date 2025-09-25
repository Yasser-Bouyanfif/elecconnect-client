"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type FormState = {
  to: string;
  subject: string;
  text: string;
};

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialFormState: FormState = {
  to: "",
  subject: "",
  text: "",
};

export default function TestSendMailPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  const handleChange = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmission({ status: "loading" });

    try {
      const response = await fetch("/api/test-send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload?.error ?? "Une erreur inconnue est survenue.");
      }

      setSubmission({
        status: "success",
        message: "E-mail envoyé avec succès ! Consultez votre boîte de réception.",
      });
      setForm(initialFormState);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
      setSubmission({ status: "error", message });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Test d’envoi d’e-mail</h1>
        <p className="mt-2 text-sm text-slate-600">
          Utilisez ce formulaire pour envoyer un e-mail via le service Resend. Renseignez simplement
          l’adresse du destinataire, un sujet et le contenu du message.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-slate-700">
              Destinataire
            </label>
            <input
              id="to"
              name="to"
              type="email"
              value={form.to}
              onChange={handleChange("to")}
              required
              placeholder="exemple@domaine.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Sujet
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange("subject")}
              required
              placeholder="Sujet de l’e-mail"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              id="text"
              name="text"
              value={form.text}
              onChange={handleChange("text")}
              required
              rows={6}
              placeholder="Votre message..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={submission.status === "loading"}
            className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {submission.status === "loading" ? "Envoi en cours..." : "Envoyer l’e-mail"}
          </button>
        </form>

        {submission.status === "success" && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{submission.message}</p>
        )}

        {submission.status === "error" && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{submission.message}</p>
        )}
      </div>
    </div>
  );
}
