import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AccessPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('Validating access token...');

  useEffect(() => {
    // Wait until token is available in the query
    if (!token) return;

    // Check if token exists and is valid
    fetch(`/api/validate-token?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          // If valid, redirect to the main game
          router.replace('/');
        } else {
          // If invalid or expired, show error
          setStatus('This temporary link has expired or is invalid.');
        }
      })
      .catch(error => {
        console.error('Error validating token:', error);
        setStatus('Error validating access. Please try again.');
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 max-w-md rounded-lg bg-gray-800 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Jua Mining Game Access</h1>
        <p className="mb-4">{status}</p>
        {status.includes('expired') && (
          <p className="text-sm text-gray-400">
            Temporary links are valid for 2 hours. Please request a new link.
          </p>
        )}
      </div>
    </div>
  );
} 