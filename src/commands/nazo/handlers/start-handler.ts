import type { SlackResponse } from '../../../slack/types';
import { PUZZLE_URL } from '../constants';

export const startHandler = async (): Promise<SlackResponse> => {
  return {
    text: `謎を解いて回答してね！\n\n謎はこちら: ${PUZZLE_URL}\n\n回答方法: \`/nazo\` で「答える」を選んで回答できるよ。\n謎を解いて、お宝をゲットしよう！`,
  };
};
