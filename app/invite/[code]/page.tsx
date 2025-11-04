// app/invite/[code]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectAuthDB, connectServerDB } from '@/lib/db';
import getServerLinkModel from '@/models/ServerLink';
import getServerMembershipModel from '@/models/ServerMembership';

export default async function InvitePage({ params }: { params: { code: string } }) {
  const { code } = params;

  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch {
    cookies().delete('auth_token');
    redirect('/login');
  }

  const ServerLink = await getServerLinkModel();
  const allServers = await ServerLink.find().lean();

  let targetServer: any = null;
  for (const srv of allServers) {
    const serverDb = await connectServerDB(srv.serverId, srv.dbUri);
    const Invite = serverDb.model('Invite', { code: String });
    const invite = await Invite.findOne({ code });
    if (invite) {
      targetServer = srv;
      await Invite.updateOne({ code }, { $inc: { uses: 1 } });
      break;
    }
  }

  if (!targetServer) {
    return <div className="p-6 text-center text-red-400">Invalid invite link.</div>;
  }

  const ServerMembership = await getServerMembershipModel();
  await ServerMembership.create({ userId, serverId: targetServer.serverId });

  redirect(`/servers/${targetServer.serverId}`);
}
