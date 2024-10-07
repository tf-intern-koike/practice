### フォルダ構成
- /src
  - /components
  - /pages ページのレイアウトを指定するファイル群
    - /mark-game-v1
    - /mark-game-v2
    - /reversi
    - _app.tsx すべてのページのテンプレート
  - /providers
  - /styles CSSファイル群

それぞれのページのリンクは、そのページに相当するフォルダの、`/pages`をルート(`/`)とする相対パスとなる(`/mark-game-v1`ならば`/.mark-game-v1`)

それぞれのページのリンクにアクセスすると、そのページに相当するフォルダから`index.ts/x`を探索し参照する(`/`ならば`/index.ts/x`を参照する)