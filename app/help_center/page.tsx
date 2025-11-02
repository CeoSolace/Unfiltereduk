// Help Center landing — static for now, will link to markdown docs later
export default function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="mb-4">Documentation for users, moderators, and developers.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><a href="/help_center/platform" className="text-blue-400 hover:underline">Platform Overview</a></li>
        <li><a href="/help_center/messaging" className="text-blue-400 hover:underline">Messaging & Encryption</a></li>
        <li><a href="/help_center/bots" className="text-blue-400 hover:underline">Bot Development Guide</a></li>
        <li><a href="/help_center/api" className="text-blue-400 hover:underline">API Reference</a></li>
      </ul>
    </div>
  );
}
