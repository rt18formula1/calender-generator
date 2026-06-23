# Google AdSense Setup Guide

このドキュメントでは、Calendar GeneratorにGoogle AdSenseを統合するための手順を説明します。

## 概要

Calendar Generatorに以下の広告ユニットが追加されました：

1. **トップ広告セクション** - ページ上部のメインコンテンツエリア
2. **サイドバー広告セクション** - 左側のコントロールパネルの下部
3. **ボトム広告セクション** - ページ下部のフッター上

## セットアップ手順

### 1. Google AdSenseアカウントの準備

- [Google AdSense](https://www.google.com/adsense/start/)にアクセスしてアカウントを作成または既存のアカウントにログインします。
- サイトを登録し、審査を完了します。

### 2. クライアントIDの取得

1. Google AdSenseダッシュボードにログインします。
2. 左側のメニューから「アカウント」を選択します。
3. 「アカウント情報」セクションから、**クライアントID**（`ca-pub-xxxxxxxxxxxxxxxx`の形式）をコピーします。

### 3. スロットIDの取得

1. Google AdSenseダッシュボードで「広告」→「広告ユニット」を選択します。
2. 新しい広告ユニットを作成するか、既存のものを使用します。
3. 各広告ユニットの**スロットID**をコピーします。

### 4. コンポーネントの更新

#### AdSenseScript.jsx

`src/components/ads/AdSenseScript.jsx` ファイルを開き、以下の行を更新します：

```javascript
script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx';
```

`ca-pub-xxxxxxxxxxxxxxxx` をあなたのGoogle AdSenseクライアントIDに置き換えます。

#### AdSenseUnit.jsx

`src/components/ads/AdSenseUnit.jsx` ファイルを開き、以下の行を更新します：

```javascript
data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
```

`ca-pub-xxxxxxxxxxxxxxxx` をあなたのGoogle AdSenseクライアントIDに置き換えます。

#### Home.jsx

`src/pages/Home.jsx` ファイルで、各広告ユニットのスロットIDを更新します：

```javascript
// トップ広告
<AdSenseUnit slotId="1234567890" format="auto" className="text-center" />

// サイドバー広告
<AdSenseUnit slotId="9876543210" format="vertical" className="flex justify-center" />

// ボトム広告
<AdSenseUnit slotId="5555555555" format="auto" className="text-center" />
```

各 `slotId` を、Google AdSenseダッシュボードで取得した実際のスロットIDに置き換えます。

### 5. デプロイ

変更をコミットしてGitHubにプッシュします：

```bash
git add -A
git commit -m "Add Google AdSense integration"
git push
```

Vercelが自動的にデプロイを開始します。

## 広告フォーマット

各広告ユニットで使用できるフォーマットは以下の通りです：

| フォーマット | 説明 |
|-------------|------|
| `auto` | レスポンシブ広告（推奨） |
| `horizontal` | 横長の広告 |
| `vertical` | 縦長の広告 |
| `rectangle` | 長方形の広告 |

## トラブルシューティング

### 広告が表示されない場合

1. **クライアントIDとスロットIDが正しいか確認**: `AdSenseScript.jsx` と `AdSenseUnit.jsx` で正しく設定されているか確認します。
2. **Google AdSenseの審査**: サイトがGoogle AdSenseの審査に合格しているか確認します。
3. **ブラウザコンソール**: ブラウザの開発者ツールでエラーメッセージを確認します。
4. **キャッシュのクリア**: ブラウザキャッシュをクリアして、ページをリロードします。

### 広告が制限されている場合

Google AdSenseの広告ポリシーに違反していないか確認します。詳細は[Google AdSenseヘルプセンター](https://support.google.com/adsense)を参照してください。

## 参考リンク

- [Google AdSense ヘルプセンター](https://support.google.com/adsense)
- [Google AdSense広告コード](https://support.google.com/adsense/answer/7528548)
- [レスポンシブ広告](https://support.google.com/adsense/answer/9261307)
