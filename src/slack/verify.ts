import type { Context } from 'hono';
import { timingSafeEqual } from '../functions/timing-safe-equal';

const encoder = new TextEncoder();

export const verifySlackRequest = async (c: Context<{ Bindings: Env }>, rawBody: string): Promise<boolean> => {
  const signature = c.req.header('X-Slack-Signature');
  const timestamp = c.req.header('X-Slack-Request-Timestamp');

  if (!signature || !timestamp) {
    return false;
  }

  // タイムスタンプが5分以内かチェック
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - Number.parseInt(timestamp, 10)) > 60 * 5) {
    return false;
  }

  // HMAC-SHA256 で署名を検証
  const sigBaseString = `v0:${timestamp}:${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(c.env.SLACK_SIGNING_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(sigBaseString));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const expectedSignature = `v0=${signatureHex}`;

  // 署名を比較
  const signatureBytes = encoder.encode(signature);
  const expectedBytes = encoder.encode(expectedSignature);
  return timingSafeEqual(signatureBytes.buffer as ArrayBuffer, expectedBytes.buffer as ArrayBuffer);
};
