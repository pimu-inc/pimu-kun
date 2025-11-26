import type { CommandContext } from 'discord-hono';
import { PUZZLE_URL } from '../constants';

type Options = {
  context: CommandContext;
};

export const startHandler = async ({ context }: Options) => {
  return context.res(
    `謎を解いて回答してね！\n\n謎はこちら: ${PUZZLE_URL}\n\n回答方法: \`/nazo answer\` で回答できるよ。\n謎を解いて、お宝をゲットしよう！`
  );
};
