import type { CommandContext } from 'discord-hono';
import { FIRST_ANSWER_HASH, SECOND_ANSWER_HASH, getFirstFlag, getRewardUrl, getSecondFlag } from '../constants';
import { sha256 } from '../functions/hash';
import { katakanaToHiragana } from '../functions/normalize';

type Options = {
  context: CommandContext;
};

export const answerHandler = async ({ context }: Options) => {
  const firstAnswer = context.var.first_answer as string | undefined;
  const secondAnswer = context.var.second_answer as string | undefined;

  const firstCorrect = firstAnswer ? (await sha256(katakanaToHiragana(firstAnswer))) === FIRST_ANSWER_HASH : false;
  const secondCorrect = secondAnswer ? (await sha256(secondAnswer)) === SECOND_ANSWER_HASH : false;

  if (firstCorrect && secondCorrect) {
    const response = [
      '全問正解！おめでとう！',
      '',
      `1問目のフラグ: ${getFirstFlag()}`,
      `2問目のフラグ: ${getSecondFlag()}`,
      '',
      '最後の謎だよ！フラグから8桁のパスワードを構築してね。さっきのFigmaの最後の問題に答えよう！',
      'ヒントは、「めせんのさき」',
      '',
      'パスワードがわかったら、次のURLにアクセスして入力してね！',
      `URL: ${getRewardUrl()}`,
      '',
    ].join('\n');
    return context.res(response);
  }

  if (firstCorrect) {
    return context.res(`1問目正解！\nフラグ: ${getFirstFlag()}`);
  }

  if (secondCorrect) {
    return context.res(`2問目正解！\nフラグ: ${getSecondFlag()}`);
  }

  return context.res('残念！もう一度挑戦してね');
};
