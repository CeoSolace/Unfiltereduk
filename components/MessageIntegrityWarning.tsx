// Shows when message signature verification fails — exactly as you specified
export default function MessageIntegrityWarning() {
  return (
    <div className="bg-red-900/50 border-l-4 border-red-500 p-3 my-2 rounded-r">
      <p className="text-red-200 font-mono text-sm">
        ⚠ Message integrity check failed — possible tampering.
      </p>
    </div>
  );
}
