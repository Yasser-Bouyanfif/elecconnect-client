"use client"
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom est obligatoire.')
    .max(100, 'Le nom est trop long.'),
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire.")
    .email('Adresse e-mail invalide.')
    .max(320, "L'adresse e-mail est trop longue."),
  phone: z
    .string()
    .optional()
    .transform((value) => (value ?? '').trim())
    .refine(
      (value) => value.length === 0 || /^[0-9+().\s-]*$/.test(value),
      'Le format du numéro de téléphone est invalide.'
    )
    .refine((value) => value.length <= 30, 'Le numéro de téléphone est trop long.'),
  message: z
    .string()
    .trim()
    .min(10, 'Le message doit contenir au moins 10 caractères.')
    .max(2000, 'Le message est trop long.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ContactFormData | undefined;
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    const sanitizedData = validation.data;
    setFieldErrors({});

    try {
      const response = await fetch('/api/resend/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: sanitizedData.name,
          phone: sanitizedData.phone,
          email: sanitizedData.email,
          content: sanitizedData.message,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        setErrorMessage(
          typeof errorBody?.error === 'string'
            ? errorBody.error
            : "Une erreur est survenue lors de l'envoi du message."
        );
        setStatus('error');
        return;
      }

      setFormData({ name: '', email: '', phone: '', message: '' });
      setStatus('success');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire de contact', error);
      setErrorMessage("Impossible d'envoyer votre demande pour le moment. Veuillez réessayer plus tard.");
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage('');
    }
    if (name in fieldErrors) {
      const nextErrors = { ...fieldErrors };
      delete nextErrors[name as keyof ContactFormData];
      setFieldErrors(nextErrors);
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
                  required
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-sm text-red-500 mt-1 sm:col-span-2">
                    {fieldErrors.name}
                  </p>
                )}
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
                {fieldErrors.phone && (
                  <p id="phone-error" className="text-sm text-red-500 mt-1 sm:col-span-2">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-500 mt-1">
                  {fieldErrors.email}
                </p>
              )}

              <textarea
                name="message"
                placeholder="Décrivez votre projet..."
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white"
              ></textarea>
              {fieldErrors.message && (
                <p id="message-error" className="text-sm text-red-500 mt-1">
                  {fieldErrors.message}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-success btn-block text-white hover:text-white flex items-center justify-center gap-2"
                disabled={status === 'loading'}
              >
                <span>{status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma demande'}</span>
                <Send className="w-4 h-4" />
              </button>
              {status === 'success' && (
                <p className="text-sm text-emerald-600 text-center">
                  Votre message a bien été envoyé. Nous vous répondrons sous 8h.
                </p>
              )}
              {status === 'error' && (
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
