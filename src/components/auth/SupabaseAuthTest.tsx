import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function SupabaseAuthTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSignup = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing Supabase signup...');
      
      // Try basic signup without profile creation first
      const { data, error } = await supabase.auth.signUp({
        email: 'testuser@gmail.com',
        password: 'TestPassword123',
      });

      console.log('Signup response:', { data, error });

      if (error) {
        setResult(`❌ Signup Error: ${error.message}`);
      } else {
        setResult(`✅ Signup Success! User ID: ${data.user?.id}`);
      }
    } catch (err: any) {
      console.error('Signup catch error:', err);
      setResult(`❌ Catch Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing Supabase connection...');
      
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' });
      
      console.log('Connection test:', { data, error });

      if (error) {
        setResult(`❌ Connection Error: ${error.message}`);
      } else {
        setResult(`✅ Connection Success! Can access profiles table.`);
      }
    } catch (err: any) {
      console.error('Connection catch error:', err);
      setResult(`❌ Connection Catch Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-200 rounded-lg p-4 text-xs max-w-sm z-50">
      <h3 className="font-semibold text-yellow-900 mb-2">Supabase Auth Test</h3>
      
      <div className="space-y-2 mb-3">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          size="sm" 
          variant="outline"
          className="w-full text-xs"
        >
          Test Connection
        </Button>
        <Button 
          onClick={testSignup} 
          disabled={loading}
          size="sm" 
          variant="outline"
          className="w-full text-xs"
        >
          Test Signup
        </Button>
      </div>

      {loading && <p className="text-yellow-800">Testing...</p>}
      
      {result && (
        <div className="mt-2 p-2 bg-white rounded text-xs">
          {result}
        </div>
      )}
    </div>
  );
}