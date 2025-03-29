import { useState } from 'react';

export default function GenerateLink() {
  const [tempLink, setTempLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTempLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/temp-link');
      const data = await response.json();
      setTempLink(data.tempLink);
    } catch (error) {
      console.error('Error generating temporary link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Generate Temporary Game Link</h1>
        
        <p className="mb-4 text-gray-300">
          Create a temporary link that will expire after 2 hours.
        </p>
        
        <button
          onClick={generateTempLink}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg mb-4 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Temporary Link'}
        </button>
        
        {tempLink && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Your Temporary Link:</h2>
            <div className="flex items-center">
              <input 
                type="text" 
                value={tempLink} 
                readOnly 
                className="flex-grow p-2 bg-gray-700 rounded-l-lg text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-sm text-yellow-400">
              This link will expire in 2 hours.
            </p>
          </div>
        )}
        
        <div className="mt-8 text-sm text-gray-400">
          <p>Note: This is a simple implementation. For a production app, you would:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Store tokens in a database instead of server memory</li>
            <li>Add proper authentication to this admin page</li>
            <li>Allow customizing expiration time</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 