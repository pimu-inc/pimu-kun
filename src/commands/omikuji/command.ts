import type { Context } from 'hono';
import { respondToUrl } from '../../slack/api';
import type { Block, SlashCommandPayload } from '../../slack/types';
import { OMIKUZI_LIST, type OmikuzaEntry, type OmikuzaRarity as Rarity } from './constant';

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

const RARITY_RATE: Record<Rarity, string> = {
  N: '60%',
  R: '25%',
  SR: '10%',
  SSR: '4%',
  UR: '1%',
};

// レア度バナー(N は控えめ、R 以上は派手に強調)
const RARITY_BANNER: Record<Rarity, string | null> = {
  N: null,
  R: '⭐ *R ・ RARE* ⭐',
  SR: '⭐⭐ *SR ・ SUPER RARE* ⭐⭐',
  SSR: '🎆⭐⭐⭐ *SSR ・ SUPER SPECIAL RARE* ⭐⭐⭐🎆',
  UR: '🌈✨⭐⭐⭐⭐ *UR ・ ULTRA RARE* ⭐⭐⭐⭐✨🌈',
};

// 演出を出す(=「上書き」アニメーションを走らせる)レア度
const PRODUCTION_RARITY: Rarity[] = ['SR', 'SSR', 'UR'];

// 抽選中→開封のあいだに挟むチラ見せ演出
const TEASER: Record<'SR' | 'SSR' | 'UR', string> = {
  SR: '🎰 おや…？なんだか光っている気がする…',
  SSR: '🎆 ピカーッ…!!\nこれは…ただ事ではない予感…!',
  UR: '🌈 ＿人人人人人人人人＿\n＞ 虹色の光が…!! ＜\n￣Y^Y^Y^Y^Y^Y^Y￣',
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
// 開封結果(最終的に表示される)ブロックを組み立てる
// ──────────────────────────────────────────────
type Lucky = { item: string; color: string; action: string; number: number };

const buildRevealBlocks = (
  fortune: OmikuzaEntry,
  payload: SlashCommandPayload,
  lucky: Lucky,
  fridayBonus: string
): Block[] => {
  const blocks: Block[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${fortune.emoji} 今日の運勢: ${fortune.result} ${fortune.emoji}`,
        emoji: true,
      },
    },
  ];

  // レア度を主役級に強調(R 以上はバナー+排出率を独立したブロックで表示)
  const banner = RARITY_BANNER[fortune.rarity];
  if (banner) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `${banner}\n\`排出率 ${RARITY_RATE[fortune.rarity]}\`` },
    });
    blocks.push({ type: 'divider' });
  }

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `<@${payload.user_id}>さんの運勢\n${fortune.comment ?? ''}${fridayBonus}`,
    },
  });

  blocks.push({
    type: 'section',
    fields: [
      { type: 'mrkdwn', text: `*🎁 ラッキーアイテム*\n${lucky.item}` },
      { type: 'mrkdwn', text: `*🎨 ラッキーカラー*\n${lucky.color}` },
      { type: 'mrkdwn', text: `*🔢 ラッキーナンバー*\n${lucky.number}` },
      { type: 'mrkdwn', text: `*✅ 開運アクション*\n${lucky.action}` },
    ],
  });

  return blocks;
};

// ──────────────────────────────────────────────
// レア演出: 「ガラガラ…」→「チラ見せ」→「開封」を response_url で上書きしていく
// ──────────────────────────────────────────────
const runRareReveal = async (responseUrl: string, fortune: OmikuzaEntry, revealBlocks: Block[]): Promise<void> => {
  const teaser = TEASER[fortune.rarity as 'SR' | 'SSR' | 'UR'];

  await sleep(1500);
  await respondToUrl(responseUrl, {
    response_type: 'in_channel',
    replace_original: true,
    text: teaser,
    blocks: [{ type: 'section', text: { type: 'mrkdwn', text: teaser } }],
  });

  await sleep(1500);
  await respondToUrl(responseUrl, {
    response_type: 'in_channel',
    replace_original: true,
    text: `今日の運勢: ${fortune.result}`,
    blocks: revealBlocks,
  });
};

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

  const lucky: Lucky = {
    item: pick(LUCKY_ITEMS),
    color: pick(LUCKY_COLORS),
    action: pick(LUCKY_ACTIONS),
    number: Math.floor(Math.random() * 99) + 1,
  };

  // 金曜日はちょっとだけ演出を盛る(JST基準)
  const day = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCDay();
  const fridayBonus = day === 5 ? '\n🎉 _金曜ボーナス:今日の運勢効果は週末まで持続します!_' : '';

  const revealBlocks = buildRevealBlocks(fortune, payload, lucky, fridayBonus);

  // レアが出たら「引いてる最中」を先に出し、裏で開封演出に上書きする
  if (PRODUCTION_RARITY.includes(fortune.rarity) && payload.response_url) {
    c.executionCtx.waitUntil(runRareReveal(payload.response_url, fortune, revealBlocks));
    return c.json({
      response_type: 'in_channel',
      text: `🎰 <@${payload.user_id}> がおみくじを引いた…`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎰 <@${payload.user_id}> がおみくじを引いた…\n\n*ガラガラ……　ガラガラ……*`,
          },
        },
      ],
    });
  }

  return c.json({
    response_type: 'in_channel',
    text: `今日の運勢: ${fortune.result}`,
    blocks: revealBlocks,
  });
};
