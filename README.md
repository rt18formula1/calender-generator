# Calendar Generator

アートワーク画像をアップロードして、オリジナルのカレンダーを生成・エクスポートできる Web アプリケーションです。

## 機能

- **テンプレート選択** — IKEAのフォトフレーム、デバイスの壁紙など複数のレイアウトテンプレートから選択可能。カスタムサイズにも対応。
- **アートワークアップロード** — 任意の画像をアップロードすると、縦長 / 横長を自動判定してレイアウトを最適化。
- **年月選択** — 任意の年・月のカレンダーを生成。
- **プレビュー** — リアルタイムでカレンダーのプレビューを確認。
- **エクスポート** — 完成したカレンダーを画像として書き出し。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 18 |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS 3 |
| UIコンポーネント | shadcn/ui (Radix UI) |
| ルーティング | React Router v6 |
| 状態管理 | TanStack React Query |
| アイコン | Lucide React |
| エクスポート | html2canvas / jsPDF |
| ホスティング | Vercel |

## セットアップ

### 前提条件

- Node.js 18 以上
- npm

### インストール

```bash
git clone https://github.com/rt18formula1/calender-generator.git
cd calender-generator
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### プロダクションビルド

```bash
npm run build
npm run preview  # ビルド結果のプレビュー
```

## デプロイ

Vercel にデプロイされています。`main` ブランチへの Push で自動デプロイが可能です。

**公開URL:** https://calendar-generator-six.vercel.app

## ライセンス

Private
