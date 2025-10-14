export function SupabaseDebug() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-200 rounded-lg p-4 text-xs max-w-sm z-50">
      <h3 className="font-semibold text-red-900 mb-2">Supabase Config Debug</h3>
      <div className="space-y-1 text-red-800">
        <p><strong>URL:</strong> {url ? `${url.substring(0, 30)}...` : '❌ NOT SET'}</p>
        <p><strong>Key:</strong> {key ? `${key.substring(0, 20)}...` : '❌ NOT SET'}</p>
        <p><strong>URL Valid:</strong> {url?.includes('supabase.co') ? '✅' : '❌'}</p>
        <p><strong>Key Valid:</strong> {key?.startsWith('eyJ') ? '✅' : '❌'}</p>
      </div>
    </div>
  );
}