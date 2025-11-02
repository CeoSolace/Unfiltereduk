// Banner shown when global owner joins a server — your exact requirement
export default function AdminPresenceBanner() {
  return (
    <div className="bg-yellow-900/50 border-b border-yellow-700 py-2 px-4 text-center">
      <span className="text-yellow-200 font-bold">
        👮 Admin Present — deletions locked
      </span>
    </div>
  );
}
