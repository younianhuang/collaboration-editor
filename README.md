## monaco-convergence專案設置

### 推薦vs code 插件
```
先到VS Code套件下載區下載VSC Export & Import
- 確認專案資料夾下有
vsc-extensions.text

- 接著按下鍵盤 Ctrl + Shift + P叫出視窗．
- 選擇
Type VSC Import
```
### npm安裝
```
//可將版本預設在16版
nvm alias default 16

//選擇16版node
nvm use 16
```
```
npm install -g yarn eslint prettier jest editorconfig typescript

//安裝模組 替代npm install
yarn
```

### convergence
```
//docker impage
docker run -p "8000:80" --name convergence convergencelabs/convergence-omnibus
```

### 檔案命名
```
小寫開頭，以 '-' 分隔
例如
index.tsx
code-editor.tsx
