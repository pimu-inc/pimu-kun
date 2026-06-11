import type { Context } from 'hono';
import type { SlashCommandPayload } from '../../slack/types';
import { OMIKUZI_LIST, type OmikuzaRarity as Rarity } from './constant';

// ──────────────────────────────────────────────
// レアリティ排出率
// ──────────────────────────────────────────────
const RARITY_WEIGHT: Record<Rarity, number> = {
  N: 600, // 60%
  R: 250, // 25%
  SR: 100, // 10%
  SSR: 40, //  4%
  UR: 10, //  1%
};

const RARITY_LABEL: Record<Rarity, string> = {
  N: '',
  R: '★ R',
  SR: '★★ SR',
  SSR: '★★★ SSR',
  UR: '🌈 ★★★★ UR 🌈',
};

// ──────────────────────────────────────────────
// ラッキー要素(組み合わせで実質無限のバリエーション)
// ──────────────────────────────────────────────
const LUCKY_ITEMS = [
  '消しゴム',
  '左の靴下',
  'USB-Cケーブル',
  'コンビニのおにぎり',
  '観葉植物',
  '付箋',
  'ワイヤレスイヤホン',
  '湯呑み',
  'キーボードのEnterキー',
  '輪ゴム',
  '青いペン',
  'モバイルバッテリー',
  'ハンカチ',
  '昨日のレシート',
  'ガムテープ',
];

const LUCKY_COLORS = [
  '群青色',
  'ミントグリーン',
  'サーモンピンク',
  '漆黒',
  'パステルイエロー',
  'ターコイズブルー',
  'ラベンダー',
  'カーキ',
  'オフホワイト',
  '小豆色',
];

const LUCKY_ACTIONS = [
  '誰かに「ありがとう」と言う',
  '深呼吸を3回する',
  'デスクの上を1分だけ片付ける',
  '水を一杯飲む',
  '窓の外を30秒眺める',
  '昔の友達に連絡してみる',
  'Slackで誰かにスタンプを押す',
  '背伸びをする',
  '甘いものを食べる',
];

// ──────────────────────────────────────────────
// 重み付き抽選
// ──────────────────────────────────────────────
const pickFortune = () => {
  // 1. まずレアリティを排出率で抽選
  const totalWeight = Object.values(RARITY_WEIGHT).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let chosenRarity: Rarity = 'N';
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHT) as [Rarity, number][]) {
    roll -= weight;
    if (roll <= 0) {
      chosenRarity = rarity;
      break;
    }
  }

  // 2. 当選レアリティのエントリから1件選ぶ(万一空ならNにフォールバック)
  const candidates = OMIKUZI_LIST.filter((f) => f.rarity === chosenRarity);
  const list = candidates.length > 0 ? candidates : OMIKUZI_LIST.filter((f) => f.rarity === 'N');
  return list[Math.floor(Math.random() * list.length)];
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;

// ──────────────────────────────────────────────
// コマンド本体
// ──────────────────────────────────────────────
export const omikujiCommand = async (
  c: Context<{ Bindings: Env }>,
  payload: SlashCommandPayload
): Promise<Response> => {
  const fortune = pickFortune();
  if (!fortune) {
    return c.json({
      response_type: 'ephemeral',
      text: '運勢が見つかりませんでした。もう一度お試しください。',
    });
  }

  const luckyItem = pick(LUCKY_ITEMS);
  const luckyColor = pick(LUCKY_COLORS);
  const luckyAction = pick(LUCKY_ACTIONS);
  const luckyNumber = Math.floor(Math.random() * 99) + 1;

  const rarityLine = fortune.rarity !== 'N' ? `\n*${RARITY_LABEL[fortune.rarity]}*` : '';

  // 金曜日はちょっとだけ演出を盛る(JST基準)
  const day = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCDay();
  const fridayBonus = day === 5 ? '\n🎉 _金曜ボーナス:今日の運勢効果は週末まで持続します!_' : '';

  return c.json({
    response_type: 'in_channel',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${fortune.emoji} <@${payload.user_id}>さんの運勢: ${fortune.result} ${fortune.emoji}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${fortune.comment ?? ''}${rarityLine}${fridayBonus}`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*🎁 ラッキーアイテム*\n${luckyItem}` },
          { type: 'mrkdwn', text: `*🎨 ラッキーカラー*\n${luckyColor}` },
          { type: 'mrkdwn', text: `*🔢 ラッキーナンバー*\n${luckyNumber}` },
          { type: 'mrkdwn', text: `*✅ 開運アクション*\n${luckyAction}` },
        ],
      },
    ],
  });
};
