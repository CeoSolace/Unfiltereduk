// Unit test for message encryption/signing pipeline
import { encryptMessage, decryptMessage, signMessage, verifySignature } from '../lib/encryption';

const SERVER_KEY = 'a'.repeat(64); // 32-byte hex

describe('Encryption Pipeline', () => {
  test('encrypts and decrypts correctly', () => {
    const plaintext = 'Hello, Unfiltered UK!';
    const { content_enc, iv } = encryptMessage(plaintext, SERVER_KEY);
    const decrypted = decryptMessage(content_enc, iv, SERVER_KEY);
    expect(decrypted).toBe(plaintext);
  });

  test('signature verifies valid payload', () => {
    const payload = 'encrypted_base64_string';
    const signature = signMessage(payload);
    const valid = verifySignature(payload, signature);
    expect(valid).toBe(true);
  });

  test('signature fails on tampered payload', () => {
    const payload = 'encrypted_base64_string';
    const signature = signMessage(payload);
    const tampered = payload + 'x';
    const valid = verifySignature(tampered, signature);
    expect(valid).toBe(false);
  });
});
