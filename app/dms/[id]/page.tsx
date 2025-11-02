// Real-time DM chat (uses your Socket.IO + encryption)
export default async function DMChat({ params }: { params: { id: string } }) {
  const { id: channelId } = params;
  // In real app: verify user is in this DM channel
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg">Direct Message</h2>
      </div>
      <div id="dm-messages" className="flex-1 p-4 overflow-y-auto">
        {/* Messages loaded via Socket.IO on client */}
      </div>
      <div className="p-4 border-t border-gray-800">
        <input
          type="text"
          id="dm-input"
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Message..."
        />
      </div>
    </div>
  );
}
