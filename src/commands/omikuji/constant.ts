export type OmikuzaRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';

export type OmikuzaEntry = {
  result: string;
  emoji: string;
  comment: string;
  rarity: OmikuzaRarity;
};

export const OMIKUZI_LIST: OmikuzaEntry[] = [
  // ──────────── 定番(クラシック) ────────────
  {
    result: '大吉',
    emoji: '🌟',
    comment: '迷ったら攻め!今日のあなたの判断はだいたい正解です。',
    rarity: 'SR',
  },
  {
    result: '中吉',
    emoji: '✨',
    comment: '派手さはないけど着実に良い日。じわじわ効いてくるタイプの幸運です。',
    rarity: 'R',
  },
  {
    result: '小吉',
    emoji: '🌼',
    comment: '信号が青のまま渡りきれる、くらいの幸せが待っています。',
    rarity: 'N',
  },
  {
    result: '吉',
    emoji: '🍀',
    comment: '何事もなく一日が終わる。それって実はすごいことなのでは?',
    rarity: 'N',
  },
  {
    result: '末吉',
    emoji: '🌱',
    comment: '幸運は終盤に配置されています。夕方まで席を立たないで!',
    rarity: 'N',
  },
  {
    result: '凶',
    emoji: '☁️',
    comment: '小雨程度の不運。折りたたみ傘的な心構えで乗り切れます。',
    rarity: 'R',
  },
  {
    result: '大凶',
    emoji: '⚡',
    comment: '今日は守りの日。大事な決断と金曜デプロイは明日以降に!',
    rarity: 'SR',
  },

  // ──────────── 仕事・Slack系の吉 ────────────
  {
    result: '会議消滅吉',
    emoji: '📅',
    comment: '今日の会議が1本くらい急にキャンセルになる予感。空いた時間は自由です!',
    rarity: 'N',
  },
  {
    result: '定時吉',
    emoji: '🏃',
    comment: '今日は定時で帰れる星回り。退勤ボタンに指を添えて待機!',
    rarity: 'N',
  },
  {
    result: '集中吉',
    emoji: '🎧',
    comment: 'ゾーンに入れる日。通知を切って大物タスクを仕留めよう!',
    rarity: 'N',
  },
  {
    result: '通知ゼロ吉',
    emoji: '🔕',
    comment: '不思議と誰にも呼ばれない平和な日。今のうちに進めたいことを!',
    rarity: 'N',
  },
  {
    result: 'スタンプ吉',
    emoji: '👍',
    comment: 'あなたの投稿にスタンプがいっぱい付く日。気軽に発言してみよう!',
    rarity: 'N',
  },
  {
    result: '雑談吉',
    emoji: '☕',
    comment: '何気ない雑談から良いアイデアが生まれる日。timesに何か書いてみては?',
    rarity: 'N',
  },
  {
    result: '返信吉',
    emoji: '📨',
    comment: 'ずっと待っていたあの返事が今日来ます。たぶん。',
    rarity: 'N',
  },
  {
    result: '即レス吉',
    emoji: '💨',
    comment: '質問を投げると秒で答えが返ってくる日。聞くなら今!',
    rarity: 'N',
  },
  {
    result: '根回し吉',
    emoji: '🤝',
    comment: '相談ごとがスッと通る日。あの提案、今日持っていこう!',
    rarity: 'R',
  },
  {
    result: '締切延長吉',
    emoji: '⏳',
    comment: 'なんと締切が延びる可能性が…!でも油断して溜めないでね!',
    rarity: 'R',
  },
  {
    result: '褒められ吉',
    emoji: '🏅',
    comment: '思わぬ人から褒められる日。謙遜しすぎず「ありがとうございます!」で受け取ろう!',
    rarity: 'R',
  },
  {
    result: '昼寝吉',
    emoji: '😴',
    comment: '15分の仮眠が午後の生産性を3倍にする日。寝すぎには注意!',
    rarity: 'N',
  },

  // ──────────── エンジニア系の吉 ────────────
  {
    result: 'ビルド一発吉',
    emoji: '🛠️',
    comment: '一発でビルドが通る日。この勢いで次のタスクへ!',
    rarity: 'N',
  },
  {
    result: 'マージ吉',
    emoji: '🔀',
    comment: 'コンフリクトゼロでマージできる日。塩漬けブランチを供養するなら今!',
    rarity: 'N',
  },
  {
    result: 'デプロイ吉',
    emoji: '🚀',
    comment: 'リリース作業が驚くほどスムーズに進む日。ただし金曜なら明日にしよう!',
    rarity: 'N',
  },
  {
    result: 'レビュー秒速吉',
    emoji: '👀',
    comment: 'PRが秒でapproveされる日。出すなら今がチャンス!',
    rarity: 'N',
  },
  {
    result: '命名吉',
    emoji: '🏷️',
    comment: '変数名がスッと決まる日。エンジニア人生で一番難しい仕事が捗ります!',
    rarity: 'N',
  },
  {
    result: 'ログ吉',
    emoji: '🔎',
    comment: 'エラーログにちゃんと答えが書いてある日。まずは落ち着いて読もう!',
    rarity: 'N',
  },
  {
    result: '再起動吉',
    emoji: '🔌',
    comment: '「再起動したら直った」が高確率で発動する日。困ったらまず再起動!',
    rarity: 'N',
  },
  {
    result: 'テスト全通吉',
    emoji: '✅',
    comment: 'CIが全部緑になる気持ちいい日。スクショして額に飾ろう!',
    rarity: 'R',
  },
  {
    result: 'バグ自然治癒吉',
    emoji: '🩹',
    comment: '再現しなくなったバグは…直ったということで!(よくない)',
    rarity: 'R',
  },
  {
    result: 'ドキュメント吉',
    emoji: '📖',
    comment: '探していた情報がちゃんとドキュメントに書いてある奇跡の日!',
    rarity: 'R',
  },
  {
    result: 'ペアプロ吉',
    emoji: '🧑‍💻',
    comment: '誰かと一緒に作業すると捗る日。詰まったら抱え込まず画面共有!',
    rarity: 'N',
  },
  {
    result: 'リファクタ吉',
    emoji: '🧼',
    comment: 'コードがみるみる綺麗になる日。ただし動いているコードへの敬意は忘れずに!',
    rarity: 'N',
  },

  // ──────────── 日常系の吉 ────────────
  {
    result: '電車吉',
    emoji: '🚃',
    comment: 'ホームに着いた瞬間に電車が来て、しかも座れる日!',
    rarity: 'N',
  },
  {
    result: '信号吉',
    emoji: '🚦',
    comment: '今日の信号は全部青。ノンストップで目的地へ!',
    rarity: 'N',
  },
  {
    result: 'レジ吉',
    emoji: '🛒',
    comment: '並んだレジが一番早く進む日。レジ選びの才能が開花しています!',
    rarity: 'N',
  },
  {
    result: 'エレベーター吉',
    emoji: '🛗',
    comment: 'ボタンを押した瞬間に扉が開く日。世界があなたに味方しています!',
    rarity: 'N',
  },
  {
    result: 'ランチ吉',
    emoji: '🍜',
    comment: '今日のランチは大当たり。気になっていたあの店、行くなら今日!',
    rarity: 'N',
  },
  {
    result: '自販機吉',
    emoji: '🥤',
    comment: '当たり付き自販機を見かけたら迷わず買おう。今日は当たる日!',
    rarity: 'N',
  },
  {
    result: 'おやつ吉',
    emoji: '🍩',
    comment: '3時のおやつが想像の1.5倍おいしく感じる日。糖分は正義!',
    rarity: 'N',
  },
  {
    result: 'カフェイン吉',
    emoji: '☕',
    comment: '一杯目のコーヒーが完璧な濃さで淹れられる日。良い一日の予感!',
    rarity: 'N',
  },
  {
    result: '二度寝セーフ吉',
    emoji: '🛏️',
    comment: '二度寝してもギリギリ間に合う日。でも三度寝は保証外です!',
    rarity: 'N',
  },
  {
    result: '天気吉',
    emoji: '☀️',
    comment: '洗濯物がカラッと乾く絶好の日和。布団も干しちゃおう!',
    rarity: 'N',
  },
  {
    result: '散歩吉',
    emoji: '🚶',
    comment: 'いつもと違う道を歩くと良いことがある日。寄り道のすすめ!',
    rarity: 'N',
  },
  {
    result: 'サウナ吉',
    emoji: '🧖',
    comment: '今日は過去最高に「ととのう」日。水風呂の温度も完璧です!',
    rarity: 'N',
  },
  {
    result: '銭湯吉',
    emoji: '♨️',
    comment: '湯上がりのコーヒー牛乳が世界一おいしい日。腰に手を当てて飲もう!',
    rarity: 'N',
  },
  {
    result: '自炊吉',
    emoji: '🍳',
    comment: '調味料が目分量でピタッと決まる日。今日のあなたは料理人!',
    rarity: 'N',
  },
  {
    result: '新曲吉',
    emoji: '🎵',
    comment: 'ドンピシャ好みの曲に出会える日。プレイリストのシャッフルを信じて!',
    rarity: 'N',
  },
  {
    result: '積読消化吉',
    emoji: '📚',
    comment: '積んでいた本がスルスル読める日。あの一冊、今日開こう!',
    rarity: 'N',
  },
  {
    result: '推し吉',
    emoji: '🌠',
    comment: '推しに関する supply が来る予感。通知をONにして待機!',
    rarity: 'N',
  },
  {
    result: 'ガチャ吉',
    emoji: '🎰',
    comment: '天井前に来る日。ただし課金は計画的に!',
    rarity: 'R',
  },
  {
    result: '掘り出し物吉',
    emoji: '🏺',
    comment: 'セールや古本屋で掘り出し物に出会える日。寄り道してみよう!',
    rarity: 'N',
  },
  {
    result: '美容院吉',
    emoji: '💇',
    comment: '「いつも通りで」が過去最高の仕上がりになる日!',
    rarity: 'N',
  },
  {
    result: '荷物吉',
    emoji: '📦',
    comment: '待っていた荷物が予定より早く届く日。再配達とは無縁です!',
    rarity: 'N',
  },

  // ──────────── 仕事・Slack系の凶 ────────────
  {
    result: '月曜凶',
    emoji: '🗓️',
    comment: '月曜の重力が通常の1.2倍。でも大丈夫、金曜は必ず来ます。',
    rarity: 'N',
  },
  {
    result: 'ミュート凶',
    emoji: '🎙️',
    comment: 'ミュートのまま熱弁しがちな日。発言前にアイコンを確認!',
    rarity: 'N',
  },
  {
    result: 'カメラON凶',
    emoji: '📹',
    comment: 'うっかりカメラONになりがちな日。上だけでもちゃんとした服を!',
    rarity: 'N',
  },
  {
    result: '誤送信凶',
    emoji: '📤',
    comment: 'DMのつもりがチャンネルに…!送信前に宛先の再確認を!',
    rarity: 'N',
  },
  {
    result: '会議連打凶',
    emoji: '🪫',
    comment: '会議が5連続で入りがちな日。水分とトイレ休憩は計画的に!',
    rarity: 'N',
  },
  {
    result: '通知爆発凶',
    emoji: '🔔',
    comment: '離席した10分間にメンションが20件溜まる日。深呼吸してから開こう!',
    rarity: 'N',
  },
  {
    result: '@channel凶',
    emoji: '📢',
    comment: '大きめの通知が飛んでくる予感。心の準備だけ”しておこう!',
    rarity: 'N',
  },
  {
    result: '仕様変更凶',
    emoji: '📋',
    comment: '「ちょっといいですか」から始まる長い話に注意。録音…じゃなくてメモを!',
    rarity: 'N',
  },
  {
    result: '隣の芝凶',
    emoji: '🌿',
    comment: '他人の進捗がやけにまぶしく見える日。あなたはあなたのペースで!',
    rarity: 'N',
  },

  // ──────────── エンジニア系の凶 ────────────
  {
    result: 'コンフリクト凶',
    emoji: '⚔️',
    comment: 'マージは計画的に。今日のgitはちょっと機嫌が悪いです。',
    rarity: 'N',
  },
  {
    result: 'ビルド失敗凶',
    emoji: '🧱',
    comment: '原因はだいたいセミコロン1個かタイポ。怒る前にdiffを見よう!',
    rarity: 'N',
  },
  {
    result: '本番凶',
    emoji: '🔥',
    comment: '今日は本番環境に優しくする日。金曜デプロイ、ダメ、ゼッタイ。',
    rarity: 'N',
  },
  {
    result: 'キャッシュ凶',
    emoji: '🗄️',
    comment: '「なんで動かないの!?」の原因は十中八九キャッシュです。',
    rarity: 'N',
  },
  {
    result: '再現しない凶',
    emoji: '👻',
    comment: '「自分の環境では動くんですけど…」を言いがちな日。',
    rarity: 'N',
  },
  {
    result: '沼凶',
    emoji: '🕳️',
    comment: '調べ物が脱線して気づいたら2時間。タイマーをかけてから検索を!',
    rarity: 'N',
  },
  {
    result: 'アップデート凶',
    emoji: '🔄',
    comment: '「更新して再起動」が一番忙しい時間に発動しがち。保存はこまめに!',
    rarity: 'N',
  },
  {
    result: 'Wi-Fi凶',
    emoji: '📶',
    comment: '大事な場面で回線が不安定になりがち。重要な作業は有線で!',
    rarity: 'N',
  },

  // ──────────── 日常系の凶 ────────────
  {
    result: '傘忘れ凶',
    emoji: '☔',
    comment: '降水確率30%は「降る」と読む日。折りたたみ傘をカバンへ!',
    rarity: 'N',
  },
  {
    result: '寝癖凶',
    emoji: '🦱',
    comment: '今日の寝癖は強敵。早めに起きて蒸しタオルで応戦を!',
    rarity: 'N',
  },
  {
    result: '靴下凶',
    emoji: '🧦',
    comment: '左右違う靴下を履きがちな日。出かける前に足元チェック!',
    rarity: 'N',
  },
  {
    result: '充電忘れ凶',
    emoji: '🪫',
    comment: 'スマホの残量19%で家を出がちな日。モバイルバッテリーを忘れずに!',
    rarity: 'N',
  },
  {
    result: '落とし物凶',
    emoji: '🪪',
    comment: 'ポケットの中身が逃亡を企てています。チャック付きポケット推奨!',
    rarity: 'N',
  },
  {
    result: '電車一本差凶',
    emoji: '🚃',
    comment: '目の前で扉が閉まりがちな日。一本早めの行動を!',
    rarity: 'N',
  },
  {
    result: '眠気凶',
    emoji: '😪',
    comment: '午後2時の眠気が手強い日。ランチの炭水化物は控えめに!',
    rarity: 'N',
  },
  {
    result: '花粉凶',
    emoji: '🤧',
    comment: '目と鼻が試される日。薬とティッシュの装備を確認!',
    rarity: 'N',
  },
  {
    result: '自動再生凶',
    emoji: '📺',
    comment: '「次のエピソードまで5秒」に抗えない日。寝る時間だけは死守!',
    rarity: 'N',
  },
  {
    result: '小腹凶',
    emoji: '🍙',
    comment: '小腹が空いた時に限っておやつの買い置きがない日。出社時に調達を!',
    rarity: 'N',
  },
  {
    result: '食べこぼし凶',
    emoji: '👕',
    comment: '白い服とミートソースの組み合わせは避けるが吉。',
    rarity: 'N',
  },
  {
    result: 'くしゃみ凶',
    emoji: '💨',
    comment: '静かな場面に限って出る大きなくしゃみに注意。前兆を感じたら退避!',
    rarity: 'N',
  },

  // ──────────── 変化球・メタ系 ────────────
  {
    result: '実質普通',
    emoji: '🤷',
    comment: '吉でも凶でもない、完全に平常運転の一日。それはそれで貴重です。',
    rarity: 'N',
  },
  {
    result: '観測不能',
    emoji: '🔭',
    comment: '開けるまで吉か凶か分からない…これがシュレディンガーのおみくじ。',
    rarity: 'R',
  },
  {
    result: '保留',
    emoji: '⏸️',
    comment: '本日の運勢は審議中です。結果は寝る前に自分で決めてください。',
    rarity: 'R',
  },
  {
    result: '凶(誤植)',
    emoji: '✏️',
    comment: '失礼しました、正しくは「吉」です。校正ミスによりラッキー2倍!',
    rarity: 'R',
  },
  {
    result: '後出し吉',
    emoji: '⏪',
    comment: '寝る前に「あ、今日いい日だったな」と気づくタイプの幸運です。',
    rarity: 'N',
  },
  {
    result: '風まかせ',
    emoji: '🍃',
    comment: '今日は流れに身を任せるのが正解。予定は未定、それでよし!',
    rarity: 'N',
  },
  {
    result: '五分五分',
    emoji: '⚖️',
    comment: '吉と凶がせめぎ合う日。最後はあなたの行動が勝敗を決めます!',
    rarity: 'N',
  },
  {
    result: '様子見',
    emoji: '🫣',
    comment: '運勢のほうがあなたの出方をうかがっています。先手必勝!',
    rarity: 'N',
  },
  {
    result: 'ノーコメント',
    emoji: '🤐',
    comment: '今日の運勢については黙秘します。…良い日だといいですね。',
    rarity: 'R',
  },
  {
    result: '占い師休業中',
    emoji: '🏖️',
    comment: '担当の神様がバカンス中のため、本日の運勢は各自で開拓してください。',
    rarity: 'R',
  },
  {
    result: '仏滅だけど吉',
    emoji: '🗓️',
    comment: '暦の上では仏滅でも、あなたの上では吉。カレンダーに勝つ日!',
    rarity: 'R',
  },
  {
    result: 'おみくじ棒折れ',
    emoji: '🥢',
    comment: 'おみくじの棒が折れました。引き直し…はできません。また明日!',
    rarity: 'R',
  },
  {
    result: '昨日の吉の残り',
    emoji: '🍱',
    comment: '昨日使い切れなかった運勢のおすそ分け。温め直せばまだいけます!',
    rarity: 'R',
  },
  {
    result: '明日に全振り',
    emoji: '📆',
    comment: '今日の運を明日に投資しました。明日のあなたに期待!',
    rarity: 'N',
  },
  {
    result: '猫の気分',
    emoji: '🐈',
    comment: '今日の運勢は猫並みに気まぐれ。撫でるタイミングを見極めて!',
    rarity: 'N',
  },
  {
    result: '充電中',
    emoji: '🔌',
    comment: '運気はただいま充電中(残り67%)。無理せずゆっくりいこう!',
    rarity: 'N',
  },
  {
    result: '運勢メンテナンス中',
    emoji: '🚧',
    comment: 'ご迷惑をおかけしております。本日中の復旧を見込んでおります。',
    rarity: 'R',
  },
  {
    result: '読み込み中…',
    emoji: '⏳',
    comment: '運勢のダウンロードに時間がかかっています。回線の良い場所でお待ちください。',
    rarity: 'R',
  },

  // ──────────── SSR(排出率 約4%) ────────────
  {
    result: '超大吉',
    emoji: '🎯',
    comment: '大吉の上位互換、降臨。今日は多少の無茶が通ります!',
    rarity: 'SSR',
  },
  {
    result: '無敵吉',
    emoji: '🛡️',
    comment: '何が起きてもプラスに変換される日。トラブルすらネタになる!',
    rarity: 'SSR',
  },
  {
    result: '全方位吉',
    emoji: '🧭',
    comment: '仕事も健康も人間関係も全部良し。死角なしの一日です!',
    rarity: 'SSR',
  },
  {
    result: '神回',
    emoji: '🎬',
    comment: '今日のあなたの人生、神回です。後で振り返りたくなるので記録を!',
    rarity: 'SSR',
  },
  {
    result: '宝くじ吉',
    emoji: '🎫',
    comment: '金運が臨界点に到達。買う・買わないはあなたの自由ですが…今日です。',
    rarity: 'SSR',
  },
  {
    result: 'プレミアム大凶',
    emoji: '💀',
    comment: '排出率4%のレア大凶!ここまで来るとむしろ持ってる。自慢しよう!',
    rarity: 'SSR',
  },
  {
    result: '隠しコマンド吉',
    emoji: '🕹️',
    comment: '上上下下左右左右…おっと、これ以上は言えません。今日は隠し要素を見つける日!',
    rarity: 'SSR',
  },

  // ──────────── UR(排出率 約1%) ────────────
  {
    result: '一周回って大吉',
    emoji: '🌀',
    comment: '凶を突き抜けた先にある伝説の境地。もう何も怖くありません!',
    rarity: 'UR',
  },
  {
    result: '龍神吉',
    emoji: '🐉',
    comment: '千年に一度の昇り龍の運勢。今日のあなたの願い、天に届きます!',
    rarity: 'UR',
  },
  {
    result: '確率1%の奇跡',
    emoji: '🌌',
    comment: 'これを引き当てたこと自体が今日最大の幸運。もう実績解除済みです!',
    rarity: 'UR',
  },

  // ──────────── 殿堂入り(初代へのオマージュ) ────────────
  {
    result: 'バグ',
    emoji: '🐛',
    comment: 'エラーが発生しました…いや、これも運命?(初代おみくじより殿堂入り)',
    rarity: 'SR',
  },
];
