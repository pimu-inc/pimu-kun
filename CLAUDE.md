# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

pimu-kun は、Slack 上で動作する社内ボットです。Cloudflare Workers + Hono で動き、以下を提供します。

- スラッシュコマンド: `/time`(勤怠記録 → Google Sheets)、`/omikuji`、`/nazo`、`/reminder`(D1 + cron)、`/uranai`(Workers AI)
- LINE 公式アカウント「TRIPLATE」のメッセージを Slack に転送する Webhook(`POST /line/webhook`、設定手順は README)

## コマンド

```bash
pnpm run build       # TypeScript 型チェック・コンパイル(service-account-key.json が必要。CI は secrets から復元)
pnpm run ci          # Biome のリント・フォーマットチェック(修正なし)
pnpm run format      # 自動フォーマット
pnpm run cf-typegen  # Cloudflare 型定義を生成
```

デプロイは main への push で GitHub Actions(`.github/workflows/deploy.yml`)が D1 マイグレーションと `wrangler deploy` を行う。

## アーキテクチャ

### 技術スタック
- **ランタイム**: Cloudflare Workers(D1、Workers AI、cron トリガー)
- **言語**: TypeScript(strict mode)
- **フレームワーク**: Hono
- **リンター**: Biome(`console` は禁止)
- **外部連携**: Slack Web API、Google Sheets API(Service Account 認証)、LINE Messaging API(Webhook 受信のみ)

### エンドポイント(`src/index.ts`)

| パス | 内容 |
|------|------|
| `POST /slack/commands` | スラッシュコマンド。`src/commands/index.ts` の `handleCommand` で振り分け |
| `POST /slack/interactions` | モーダル送信・ボタン押下。`src/interactions/index.ts` の `handleInteraction` で振り分け |
| `POST /line/webhook` | LINE の Webhook。署名検証後、`waitUntil` で Slack に転送して即 200 を返す |
| `scheduled` | 毎分の cron。期限が来たリマインダーを送信 |

Slack のリクエストは `src/slack/verify.ts`、LINE のリクエストは `src/line/verify.ts` で署名を検証する。どちらも生のボディ(`c.req.text()`)を使う。

### ディレクトリ構成

```
src/
├── index.ts            # ルーティング
├── commands/<name>/
│   ├── command.ts      # スラッシュコマンドの受け口(モーダルを開く、即時応答する等)
│   ├── interaction.ts  # モーダル送信(view_submission)の処理
│   ├── block-actions.ts# ボタン等(block_actions)の処理
│   ├── modal.ts        # モーダルの view 定義、callback_id / action_id 定数
│   ├── handlers/       # サブ処理ごとの Slack 入出力
│   └── functions/      # ビジネスロジック(Slack/Hono に依存しない)
├── interactions/       # interaction の振り分け
├── line/               # LINE Webhook(署名検証、Slack 転送)
├── slack/              # Slack API クライアント、型、署名検証
├── clients/            # Google Sheets API(fetch ベース)
├── functions/          # 共通ユーティリティ
└── types/result.ts     # Result 型
```

コマンドごとに必要なファイルだけ置く(例: `omikuji` は `command.ts` のみ)。

### コマンドの追加手順
1. `src/commands/<name>/command.ts` に `(c, payload) => Promise<Response>` を実装する
2. `src/commands/index.ts` の `switch` に `case '/<name>'` を追加する
3. モーダルを使う場合は `interaction.ts` を作り、`src/interactions/index.ts` に `callback_id` の分岐を追加する
4. Slack App 側(api.slack.com)でスラッシュコマンドを登録する

### 実装の約束
- `functions/` は Slack/Hono に依存させない。Hono の `Context` を受け取るのは `command.ts` / `interaction.ts` / `handlers/` まで
- Slack の 3 秒制限を超えうる処理(AI 生成、外部 API など)は `c.executionCtx.waitUntil(...)` で裏に回す
- `waitUntil` 内の失敗を記録したいときは `throw` する(Workers の observability に例外として残る)
- エラーは Result 型で返す

```typescript
type Result<T> = { success: true; data: T } | { success: false; message: string };
```

### 設定値とシークレット
- 公開してよい設定は `wrangler.toml` の `[vars]`、シークレットは `wrangler secret put` で入れる(`keep_vars = true`)
- Env を増やしたら `worker-configuration.d.ts` にも型を追加する
- ローカル開発用のシークレットは `.dev.vars`(git 管理外)

### 注意点
- Cloudflare Workers 環境のため、Node.js 依存のライブラリは使用不可(googleapis SDK も不可)
- タイムゾーンは `Asia/Tokyo` 固定(JST)
