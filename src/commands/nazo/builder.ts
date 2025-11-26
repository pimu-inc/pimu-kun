import { Command, Option, SubCommand } from 'discord-hono';

export const nazoBuilder = new Command('nazo', '謎解きに挑戦するよ').options(
  new SubCommand('start', '謎を確認するよ'),
  new SubCommand('answer', '謎の答えを回答するよ').options(
    new Option('first_answer', '1問目の答え'),
    new Option('second_answer', '2問目の答え')
  )
);
