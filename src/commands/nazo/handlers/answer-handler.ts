import type { SlackResponse } from '../../../slack/types';
import { FIRST_ANSWER_HASH, SECOND_ANSWER_HASH, getFirstFlag, getRewardUrl, getSecondFlag } from '../constants';
import { sha256 } from '../functions/hash';
import { katakanaToHiragana } from '../functions/normalize';

type Options = {
  firstAnswer: string | null;
  secondAnswer: string | null;
};

export const answerHandler = async ({ firstAnswer, secondAnswer }: Options): Promise<SlackResponse> => {
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
    return { text: response };
  }

  if (firstCorrect) {
    return { text: `1問目正解！\nフラグ: ${getFirstFlag()}` };
  }

  if (secondCorrect) {
    return { text: `2問目正解！\nフラグ: ${getSecondFlag()}` };
  }

  return { text: '残念！もう一度挑戦してね' };
};
