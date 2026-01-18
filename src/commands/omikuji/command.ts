import type { Context } from 'hono';
import type { SlashCommandPayload } from '../../slack/types';
import { OMIKUZI_LIST } from './constant';

export const omikujiCommand = async (
  c: Context<{ Bindings: Env }>,
  _payload: SlashCommandPayload
): Promise<Response> => {
  // ランダムに運試し結果を選択
  const fortune = OMIKUZI_LIST[Math.floor(Math.random() * OMIKUZI_LIST.length)];

  if (fortune) {
    return c.json({
      response_type: 'in_channel',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${fortune.emoji} 今日の運勢: ${fortune.result} ${fortune.emoji}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: fortune.comment || '',
          },
        },
      ],
    });
  }

  return c.json({
    response_type: 'ephemeral',
    text: '運勢が見つかりませんでした。もう一度お試しください。',
  });
};
