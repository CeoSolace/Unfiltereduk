// Test IP anonymisation: same IP → same psi, different IP → different psi
import { anonymiseIP } from '../lib/ipTools';

describe('IP Anonymisation', () => {
  test('same IP yields same ip_psi', async () => {
    const ip = '192.168.1.1';
    const first = await anonymiseIP(ip);
    const second = await anonymiseIP(ip);
    expect(first.ip_psi).toBe(second.ip_psi);
    expect(first.ip_hash).toBe(second.ip_hash);
  });

  test('different IPs yield different ip_psi', async () => {
    const ip1 = '192.168.1.1';
    const ip2 = '10.0.0.1';
    const a = await anonymiseIP(ip1);
    const b = await anonymiseIP(ip2);
    expect(a.ip_psi).not.toBe(b.ip_psi);
  });
});
