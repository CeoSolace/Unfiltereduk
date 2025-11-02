// Transparency modal shown before joining any server
import { useState } from 'react';

export default function ServerConsentModal({
  serverName,
  onAccept,
  onDecline,
}: {
  serverName: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Join {serverName}?</h2>
        <p className="mb-4 text-gray-300">
          Each community hosts its own database. Unfiltered UK cannot access or delete that data. 
          Join only if you trust the community.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="consent"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="consent" className="text-sm text-gray-400">
            I understand and accept the risks
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={!accepted}
            className={`px-4 py-2 rounded ${
              accepted
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            Join Server
          </button>
        </div>
      </div>
    </div>
  );
}
