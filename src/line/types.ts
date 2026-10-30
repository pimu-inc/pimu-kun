// LINE Messaging API Webhook のうち、転送に使う項目だけを定義する

export type LineMessage =
  | { type: 'text'; id: string; text: string }
  | { type: 'sticker' | 'image' | 'video' | 'audio' | 'file' | 'location'; id: string };

export type LineEvent = { type: 'message'; timestamp: number; message: LineMessage } | { type: string };

export type LineWebhookBody = {
  destination: string;
  events: LineEvent[];
};
