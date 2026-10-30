import { timingSafeEqual } from '../functions/timing-safe-equal';

const encoder = new TextEncoder();

// X-Line-Signature は、チャネルシークレットを鍵にしたリクエストボディの HMAC-SHA256 を base64 にしたもの
export const verifyLineSignature = async (
  channelSecret: string,
  rawBody: string,
  signature: string | undefined
): Promise<boolean> => {
  if (!signature) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(channelSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  const signatureBytes = encoder.encode(signature);
  const expectedBytes = encoder.encode(expectedSignature);
  return timingSafeEqual(signatureBytes.buffer as ArrayBuffer, expectedBytes.buffer as ArrayBuffer);
};
