# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

uplim-kunは、Discord上で動作する勤怠管理ボットです。Discordスラッシュコマンドを通じて勤務時間・休憩時間を記録し、Google Sheetsに自動保存します。Cloudflare Workers上で動作します。

## コマンド

```bash
# TypeScriptコンパイル
npm run build

# リント・フォーマットチェック（CI用、修正なし）
npm run ci

# コード自動フォーマット
npm run format

# Discordにスラッシュコマンドを登録
npm run register

# Cloudflare Workersにデプロイ
npm run deploy

# Cloudflare型定義を生成
npm run cf-typegen
```

## アーキテクチャ

### 技術スタック
- **ランタイム**: Cloudflare Workers
- **言語**: TypeScript（strict mode）
- **フレームワーク**: discord-hono（Hono + Discord Bot）
- **リンター**: Biome
- **外部連携**: Google Sheets API（Service Account認証）

### コード構成

**エントリーポイント**
- `src/index.ts` - メインアプリケーション（Botハンドラー登録）
- `src/register.ts` - Discordコマンド登録スクリプト

**コマンド実装パターン** (`src/commands/`)
```
commands/<command-name>/
├── builder.ts      # コマンド定義（オプション、サブコマンド）
├── handler.ts      # サブコマンドルーティング
├── handlers/       # 各サブコマンドのハンドラー
└── functions/      # ビジネスロジック（Google Sheets操作等）
```

## コマンドの追加方法

### 1. シンプルなコマンド（サブコマンドなし）

`omikuzi`コマンドのようにサブコマンドがない場合:

```
src/commands/<command-name>/
├── builder.ts   # コマンド定義
└── handler.ts   # 処理ロジック
```

**builder.ts** - コマンドの定義のみ
```typescript
import { Command } from 'discord-hono';
export const myCommandBuilder = new Command('mycommand', 'コマンドの説明');
```

**handler.ts** - 処理ロジック
```typescript
import type { CommandContext } from 'discord-hono';

type Options = { context: CommandContext };

export const myCommandHandler = async ({ context }: Options) => {
  return context.res('レスポンス');
};
```

### 2. サブコマンドを持つコマンド

`time`コマンドのように複数のサブコマンドがある場合:

```
src/commands/<command-name>/
├── builder.ts      # コマンド・サブコマンド定義
├── handler.ts      # サブコマンドのルーティング
├── handlers/       # 各サブコマンドのハンドラー
│   └── xxx-handler.ts
└── functions/      # ビジネスロジック（外部API操作等）
    └── xxx.ts
```

**builder.ts** - サブコマンドとオプションを定義
```typescript
import { Command, Option, SubCommand } from 'discord-hono';

export const myCommandBuilder = new Command('mycommand', 'コマンドの説明').options(
  new SubCommand('action1', 'アクション1の説明').options(
    new Option('param', 'パラメータの説明').required()
  ),
  new SubCommand('action2', 'アクション2の説明')
);
```

**handler.ts** - サブコマンドをルーティングするだけ（ロジックは書かない）
```typescript
import type { CommandContext } from 'discord-hono';
import { action1Handler } from './handlers/action1-handler';
import { action2Handler } from './handlers/action2-handler';

type Options = { context: CommandContext };

export const myCommandHandler = async ({ context }: Options) => {
  switch (context.sub.string) {
    case 'action1':
      return await action1Handler({ context });
    case 'action2':
      return await action2Handler({ context });
    default:
      return await action1Handler({ context });
  }
};
```

**handlers/xxx-handler.ts** - Discordの入出力を担当
```typescript
import type { CommandContext } from 'discord-hono';
import { myFunction } from '../functions/my-function';

type Option = { context: CommandContext };

export const action1Handler = async ({ context }: Option) => {
  const param = context.var.param;  // オプション値の取得

  const result = await myFunction({ param, env: context.env });

  if (!result.success) {
    return context.res(result.message);
  }
  return context.res(`成功: ${result.data}`);
};
```

**functions/xxx.ts** - ビジネスロジック（Discordに依存しない）
```typescript
import type { Result } from '../../types/result';

type Options = { param: string; env: Env };

export const myFunction = async ({ param, env }: Options): Promise<Result<string>> => {
  // Google Sheets操作などのビジネスロジック
  return { success: true, data: '処理結果' };
};
```

### 3. コマンドの登録

**src/commands/index.ts** にbuilderとhandlerを追加:
```typescript
import { myCommandBuilder } from './mycommand/builder';
import { myCommandHandler } from './mycommand/handler';

export const commands = [timeBuilder, omikuziBuilder, myCommandBuilder];
export const handlers = {
  time: timeHandler,
  omikuzi: omikuziHandler,
  mycommand: myCommandHandler,
};
```

**src/index.ts** にルーティングを追加:
```typescript
const app = new DiscordHono()
  .command('mycommand', (context) => handlers.mycommand({ context }));
```

### 4. Discordへの登録

コマンド定義を変更したら、Discordに再登録が必要:
```bash
npm run build && npm run register
```

### ファイルの責務まとめ

| ファイル | 責務 | Discordへの依存 |
|---------|------|----------------|
| builder.ts | コマンド構造の定義（名前、説明、オプション） | あり |
| handler.ts | サブコマンドのルーティングのみ | あり |
| handlers/*.ts | 入出力の変換、レスポンス生成 | あり |
| functions/*.ts | ビジネスロジック、外部API操作 | **なし** |

`functions/`はDiscordに依存しないため、単体テストがしやすい設計になっている。

**Google Sheets API** (`src/clients/`)
- fetchベースの実装（googleapis SDKはNode.js依存のため使用不可）
- `cloudflare-workers-and-google-oauth`でService Account認証

### エラーハンドリング

Result型パターンを使用:
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; message: string };
```

### 注意点
- Cloudflare Workers環境のため、Node.js依存のライブラリは使用不可
- タイムゾーンは`Asia/Tokyo`固定（JST）
- `console`の使用はBiomeで禁止されている
