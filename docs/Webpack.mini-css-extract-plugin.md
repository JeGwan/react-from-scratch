# mini-css-extract-plugin

css를 추출하여 개별 파일로 만들어주는데, css를 포함하는 js파일 마다 하나의 css파일을 만듭니다. 또한 On-Demand-Lading 도 지원합니다.

새로운 webpack v5 위에서 빌드하므로 webpack5가 필요합니다.

`extract-text-webpack-plugin` 과의 비교

- Async loading : 비동기적으로 css를 불러올 수 있게 해주나봐요.
- No duplicate compilation (performance) : 중복 빌드를 하지 않나봅니다!
- Easier to use
- Specific to CSS

## 설치

```bash
yarn add -D mini-css-extract-plugin
```

css-loader와 함께 쓰는 것을 권장합니다.
이제 웹팩 설정에 다음과 같이 추가합니다.

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

`style-loader`의 대체 역할입니다.
다만 개발 환경에서는 매번 css를 빌드해야되니 오히려 느릴 수 있어서, 개발 환경에서는 `style-loader`를 프로덕션에서는 `MiniCssExtractPlugin`를 쓰게 할 수 있습니다.

다음처럼요.

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};
```

다만 이렇게 될 경우 개발환경과 빌드 환경에서 css가 적용되는 순서, 분할등이 달라지므로 너무 느리지 않다면 같게 하는 것이 좋을 것 같습니다.

## Plugin options

### filename

빌드될 css파일 이름입니다.

### chunkFilename

빌드될 entry가 아닌 css파일 이름입니다.

### insert

링크 태그를 어디에 삽입시킬지 결정합니다.

### attributes

엘리먼트에 특정 속성을 함께 붙일 수 있습니다.

```js
new MiniCssExtractPlugin({
  attributes: {
    id: "target",
    "data-target": "example",
  },
});
```

## Loader options

### publicPath

`output.publicPath`과 같은 역할입니다만 특별히 `css`안에 쓰여진 외부 리소스의 publicPath를 지정합니다.
기본 값은 `output.publicPath`을 따라갑니다.

### emit

css 파일을 따로 파일시스템에 쓸지를 지정합니다. false라면 추출은 하지만 파일로 뱉어내진 않습니다.
기본 값은 `false`입니다.

## esMoudle

기본적으로 `mini-css-extract-plugin`는 ESM 문법의 JS 모듈을 생성합니다. ESM 문법으로 하면 좋은게 모듈을 합치거나 tree shaking하기가 좋습니다. 물론 CJS 문법으로도 쓸 수 있습니다.
기본 값은 `true`입니다.
