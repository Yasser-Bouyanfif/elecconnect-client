"use client";

import { FormEvent, useState } from "react";

interface ApiResponse {
  success: boolean;
  message: string;
  details?: string;
}

const DEFAULT_FORM = {
  to: "",
  subject: "",
  message: "",
};

export default function TestEmailPage() {
  const [formState, setFormState] = useState(DEFAULT_FORM);
  const [status, setStatus] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          success: false,
          message: data?.error ?? "Une erreur est survenue lors de l’envoi du message.",
          details: data?.details,
        });
      } else {
        setStatus({
          success: true,
          message: "E-mail envoyé avec succès.",
          details: data?.id ? `Identifiant: ${data.id}` : undefined,
        });
        setFormState(DEFAULT_FORM);
      }
    } catch (error) {
      setStatus({
        success: false,
        message: "Impossible de joindre le service d’envoi d’e-mails.",
        details: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Test d’envoi d’e-mail</h1>
        <p className="text-muted-foreground text-sm">
          Utilisez ce formulaire pour envoyer un message de test via Resend.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium" htmlFor="to">
            Destinataire
          </label>
          <input
            id="to"
            type="email"
            required
            value={formState.to}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, to: event.target.value }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            placeholder="exemple@domaine.com"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium" htmlFor="subject">
            Objet
          </label>
          <input
            id="subject"
            type="text"
            required
            value={formState.subject}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, subject: event.target.value }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            placeholder="Objet du message"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={formState.message}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, message: event.target.value }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            placeholder="Contenu de votre message"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le test"}
        </button>
      </form>

      {status && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            status.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <p className="font-medium">{status.message}</p>
          {status.details && <p className="mt-1 text-xs">{status.details}</p>}
        </div>
      )}
    </div>
  );
}
