# pimu-kun

## LINE 公式アカウント(TRIPLATE)→ Slack 転送

LINE 公式アカウント「TRIPLATE」に届いたメッセージを、Slack のチャンネルに転送します。

- エンドポイント: `POST /line/webhook`(LINE Messaging API の Webhook)
- テキストは本文をそのまま引用形式で投稿します。スタンプ・画像・動画・音声・ファイル・位置情報は `[スタンプ]` などのラベルだけを投稿します
- 投稿に失敗した場合は Workers の observability(Logs)に例外として残ります

### 必要な設定

| 名前 | 種類 | 内容 |
|------|------|------|
| `LINE_CHANNEL_SECRET` | シークレット | LINE Official Account Manager → 設定 → Messaging API の Channel secret。署名検証に使う |
| `LINE_NOTIFY_SLACK_CHANNEL_ID` | `wrangler.toml` の `[vars]` | 転送先の Slack チャンネル ID |
| `SLACK_BOT_TOKEN` | シークレット | 既存のもの |

### セットアップ手順

1. `wrangler secret put LINE_CHANNEL_SECRET` でチャネルシークレットを登録する
2. Slack で ぴむくん を転送先チャンネルに招待する(`chat.postMessage` は参加中のチャンネルにしか投稿できない)
3. デプロイ後、LINE Official Account Manager の Webhook URL を `https://<ワーカーのURL>/line/webhook` に設定し、LINE Developers の「検証」で 200 が返ることを確認する
