import type { CommandContext } from 'discord-hono';
import { answerHandler } from './handlers/answer-handler';
import { startHandler } from './handlers/start-handler';

type Options = {
  context: CommandContext;
};

export const nazoHandler = async ({ context }: Options) => {
  const subCommand = context.sub.string;

  switch (subCommand) {
    case 'start':
      return await startHandler({ context });
    case 'answer':
      return await answerHandler({ context });
    default:
      return await startHandler({ context });
  }
};
