# AI開発エージェント指示書

## プロジェクト概要

**プロジェクト名**: hear-navi  
**目的**: クライアント要件ヒアリングナビゲーションシステム  
**技術スタック**: Next.js 16.1.6, React 19, TypeScript, Tailwind CSS, shadcn/ui

## プロジェクト構造

```
hear-navi/
├── app/                    # Next.js App Router
│   ├── hearing/           # ヒアリング機能
│   │   ├── config.ts      # カテゴリ・セクション設定
│   │   └── [category]/    # 動的ルート
│   └── globals.css        # グローバルスタイル
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # shadcn/ui基盤コンポーネント
│   ├── header.tsx
│   ├── pagination.tsx
│   ├── side-bar.tsx
│   └── step-bar.tsx
└── lib/                  # ユーティリティ
```

## 開発ガイドライン

### 1. コンポーネント設計原則

- **再利用性**: 小さく、単一責任のコンポーネントを作成
- **型安全性**: TypeScriptを活用し、厳密な型定義
- **アクセシビリティ**: WAI-ARIA準拠、キーボードナビゲーション対応
- **レスポンシブ**: モバイルファーストアプローチ

### 2. ファイル命名規則

- コンポーネント: `kebab-case.tsx` (例: `step-bar.tsx`)  
- ページ: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- 設定ファイル: `config.ts`
- ユーティリティ: `utils.ts`

### 3. コーディング規約

#### TypeScript
```typescript
// インターface定義（設定データ用）
export interface Section {
    title: string;
    label: string;
}

// Props型定義
interface ComponentProps {
    title: string;
    onNext: () => void;
    className?: string;
}
```

#### スタイリング
- **Tailwind CSS**: ユーティリティクラス優先
- **shadcn/ui**: 基盤UIコンポーネント使用
- **CSS Variables**: テーマカラー管理

```typescript
// 正しい例
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  次へ
</button>
```

### 4. ヒアリング機能の実装

#### カテゴリ構成
- `requirements`: 要件（自己紹介、背景、会社詳細、目的、AI活用）
- `target`: ターゲット（法人・個人、性別、年齢、属性）
- `function`: 機能（自己紹介、サイト種類、ページ、機能）
- `image`: イメージ（抽象的、印象1-3）
- `proposal`: 提案

#### ルーティング
```
/hearing/[category]/[section]
```

### 5. 状態管理

- **URLパラメータ**: 現在のカテゴリ・セクション
- **ローカル状態**: フォーム入力データ
- **セッション**: 回答の一時保存

### 6. UIコンポーネント使用例

```typescript
// Step-by-stepナビゲーション
<StepBar 
  currentStep={currentStep} 
  totalSteps={totalSteps} 
/>

// サイドバーナビゲーション
<SideBar 
  categories={Categories}
  currentCategory={category}
  currentSection={section}
/>

// ページネーション
<Pagination 
  onNext={handleNext}
  onPrev={handlePrev}
  isFirstStep={isFirstStep}
  isLastStep={isLastStep}
/>
```

### 7. 新機能開発時の留意事項

#### フォーム実装
- React Hook Formまたはフォーム状態管理の検討
- バリデーション実装
- 回答保存機能

#### レスポンシブ対応
```typescript
// モバイル対応例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### アクセシビリティ
- `aria-labels`追加
- フォーカス管理
- スクリーンリーダー対応

### 8. テスト戦略

- **Unit Tests**: コンポーネント単位
- **Integration Tests**: ページ間遷移
- **E2E Tests**: ヒアリングフロー全体

### 9. パフォーマンス最適化

- **動的インポート**: 大きなコンポーネントの遅延読み込み
- **画像最適化**: Next.js Image コンポーネント使用
- **バンドル分析**: 不要な依存関係の除去

### 10. デプロイメント

- **ビルド**: `npm run build`
- **開発サーバー**: `npm run dev`
- **Linting**: `npm run lint`

## 開発時の注意事項

1. **設定変更**: `app/hearing/config.ts`でカテゴリ・セクション管理
2. **型安全性**: すべてのPropsとstate に型定義必須
3. **UIの一貫性**: shadcn/uiコンポーネントを基盤として使用
4. **ナビゲーション**: App Routerの動的ルーティング活用
5. **データ永続化**: 将来的なデータベース統合を考慮した設計

## 今後の拡張予定

- [ ] 回答データのエクスポート機能
- [ ] テンプレート機能
- [ ] 多言語対応
- [ ] AI回答分析機能
- [ ] PDF レポート生成

---

**最終更新**: 2026年2月11日
**バージョン**: 0.1.0