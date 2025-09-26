'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type ApiOk = { success: true; resendId?: string | null };
type ApiErr = { error: string };
type ApiResponse = ApiOk | ApiErr;

export default function ResendTesterPage() {
  const search = useSearchParams();
  const sidFromQuery = search.get('sid') || search.get('stripeSessionId') || '';

  const [stripeSessionId, setStripeSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);

  useEffect(() => {
    if (sidFromQuery) setStripeSessionId(sidFromQuery);
  }, [sidFromQuery]);

  const disabled = useMemo(() => loading || !stripeSessionId.trim(), [loading, stripeSessionId]);

  const callApi = async () => {
    try {
      setLoading(true);
      setResult(null);
      setHttpStatus(null);

      const res = await fetch('/api/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeSessionId: stripeSessionId.trim() }),
      });

      setHttpStatus(res.status);
      const data = (await res.json()) as ApiResponse;
      setResult(data);
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Unexpected error' });
      setHttpStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await callApi();
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Test envoi email — /api/resend</h1>
        <p className="text-stone-600 mb-8">
          Entrez un <code className="px-1 py-0.5 bg-stone-200 rounded">stripeSessionId</code> et lancez le test.
          Astuce : vous pouvez pré-remplir via l’URL&nbsp;
          <code className="px-1 py-0.5 bg-stone-200 rounded">/test-resend?sid=cs_test_123</code>.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium mb-2">stripeSessionId</label>
          <input
            value={stripeSessionId}
            onChange={(e) => setStripeSessionId(e.target.value)}
            placeholder="cs_test_***"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={disabled}
              className={`px-4 py-2 rounded-lg text-white ${disabled ? 'bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'} transition`}
            >
              {loading ? 'Envoi…' : 'Tester /api/resend'}
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setHttpStatus(null);
              }}
              className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 transition"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-6 bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Résultat</h2>
            {httpStatus !== null && (
              <span className="text-xs px-2 py-1 rounded bg-stone-100 text-stone-700">HTTP {httpStatus}</span>
            )}
          </div>

          {!result && <p className="text-stone-500 text-sm">Aucun appel effectué pour le moment.</p>}

          {result && 'success' in result && result.success && (
            <div className="text-sm">
              <p className="text-green-700 font-medium">✅ Succès</p>
              <pre className="mt-2 text-xs bg-stone-100 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {result && 'error' in result && (
            <div className="text-sm">
              <p className="text-red-700 font-medium">❌ Erreur</p>
              <pre className="mt-2 text-xs bg-stone-100 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-stone-500">
          Endpoint ciblé : <code className="bg-stone-200 px-1 py-0.5 rounded">POST /api/resend</code>
        </div>
      </div>
    </div>
  );
}
