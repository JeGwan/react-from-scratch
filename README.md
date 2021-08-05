# React from scratch

## 0. Introduction

이 프로젝트는 CRA 등 보일러플레이트 도구를 사용하지 않고 정말 제로 베이스에서 리액트 프로젝트를 만드는 과정을 보여드리고자 합니다.

크게 다음 꼭지들이 있습니다.

- 초기 패키지 준비
- Babel이 필요한 이유 및 설치와 설정
- Webpack 필요한 이유 및 설치와 설정
- Webpack dev server
- React에서 Hot Module Replacement 적용
- sass-loader 적용
- css삽입에 대한 여러 방법
- TypeScript로의 마이그레이션

## 1. 초기 패키지 준비

```bash
# 프로젝트를 만들고 싶은 디렉토리에서
mkdir react-from-scratch && cd react-from-scratch
npm init -y
yarn add react react-dom web-vitals
```

## 빌드를 위한 도구 설치

## 2. Babel이 필요한 이유 및 설치와 설정

### Babel은 왜 필요한가요? 🤔

리액트를 JSX문법을 써서 만드는게 편하죠? 또한 우리는 ES6 작성해도 크로스 브라우징이 되는 찰떡같은 코드로 변경시켜줄 도구가 필요합니다.
바벨이 그런 도구입니다.

- JSX, ES6 을 ES5 코드로 컴파일 해줍니다.
- 브라우저 호환성을 위한 polyfill도 해줍니다.

설치해봅시다.

```bash
yarn add -D @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

- `@babel/core` : 바벨이 파일을 컴파일 해주는 핵심 소스들이 여기에 있습니다.
- `@babel/cli` : 바벨 명령어를 커맨드라인에서 사용할 수 있게 해주는 패키지입니다.
- `@babel/preset-env` : 최신 ES6+ 문법을 쓰고 브라우저에서 동작하는 자바스크립트로 변환해줍니다. 옵셔널로 폴리필도 해줍니다.
- `@babel/preset-react` : 핵심은 JSX 문법을 자바스크립트 코드로 바꿔주는 역할입니다.

#### 아니 왜케 쪼개놓나요? 설치하기 골치 아프게 😡

다양한 환경에서 필요한 기능이 서로 다를 텐데, 한 몸뚱아리로 거대하게 갖는 것보단, 파일 컴파일에 필요한 녀석을 선택적으로 설치할 수 있게 하기 위함입니다.

리액트에서는 저거 네개 다 필요하니까 달달 외우세여 ㅡㅡ 따라해봅시다.

> CCPP! 코어! 씨엘아이! 프리셋엔브! 프리셋리액트!

자 근데 설치만 한다고 앱이 빌드하는 방법을 아는게 아닙니다. 연장만 들고 있는 상태죠.
이제 _"이거 들고 어떻게 일해라"_ 라고 가르쳐 줘야합니다. 컴퓨터는 멍청하니까요.

자 프로젝트 루트에다가 다음 파일 딱 생성합시다.

- `.babelrc` : 바벨이 어떤 preset, plugin을 이용해 파일을 컴파일할지 적어주는 설정 문서입니다.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

자 설정까지 다 해줬습니다. 이제 컴파일 명령어만 내리면 됩니다. 한번 해봅시다.
테스트를 위해 다음 파일을 작성해봅시다.

```js
// src/test.js

// Arrow function & Default parameter
const f = (x, y = 7, z = 42) => x + y + z;
f(1) === 50;

// Spread operator
var params = ["hello", true, 7];
var other = [1, 2, ...params];

// Template literal, String interpolation
var customer = { name: "Foo" };
var card = { amount: 7, product: "Bar", unitprice: 42 };
var message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?`;

// Promise
new Promise((resolve, reject) => {
  resolve();
}).finally(() => console.log("end"));
```

이제 cli에서 바벨로 트랜스폼 해주는 명령어를 내려봅시다.

```bash
npx babel src/test.js --out-dir dist
```

결과를 봅시다.

```js
// dist/test.js

"use strict";

// Arrow function & Default parameter
var f = function f(x) {
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
  var z =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 42;
  return x + y + z;
};

f(1) === 50; // Spread operator

var params = ["hello", true, 7];
var other = [1, 2].concat(params); // Template literal, String interpolation

var customer = {
  name: "Foo",
};
var card = {
  amount: 7,
  product: "Bar",
  unitprice: 42,
};
var message = "Hello "
  .concat(customer.name, ",\nwant to buy ")
  .concat(card.amount, " ")
  .concat(card.product, " for\na total of ")
  .concat(card.amount * card.unitprice, " bucks?"); // Promise

new Promise(function (resolve, reject) {
  resolve();
})["finally"](function () {
  return console.log("end");
});
```

음... 다 잘 바뀌는데??
잉??? `Promise`의 polyfill이 안보이넵쇼??

잠깐 `@babel/preset-env`가 어떻게 컴파일 하는지 알아볼 필요가 있습니다.

#### `@babel/preset-env`는 어떻게 컴파일을 하는가

브라우저별로 지원되거나 지원되지 않는 기능들이 있을겁니다. 바벨에서는 이런 것을 모아 모아서 어떤 브라우저의 어떤 버전이 어떤걸 지원하는지 mapping 해두었습니다. [여기](https://github.com/babel/babel/blob/main/packages/babel-compat-data/data/plugins.json)를 들어가보세요!

우리가 특정 타겟 브라우저들을 입력해주면, 바벨을 해당 브라우저들이 지원하지 않는 문법을 변환해주거나, 아예 없는 기능들은 폴리필로 만들어줍니다.

타겟 브라우저 설정은 `targets` 라는 옵션으로 할 수 있습니다.
근데 아까 우리가 타겟 브라우저들을 정해주었나요?
안했죠. 안해줄 때 `@babel/preset-env` 는 오로지 ES6+ -> ES5 로만 컴파일 합니다.

아무것도 안넣어줄 때도 좀... 해주지 왜 그랬냐구요?

> Since one of the original goals of preset-env was to help users easily transition from using preset-latest, it behaves similarly when no targets are specified: preset-env will transform all ES2015-ES2020 code to be ES5 compatible - 출처 : https://babeljs.io/docs/en/babel-preset-env#no-targets

`preset-latest`를 쓰던 사용자가 쉽게 전환하게 하기 위해서입니다. `preset-latest`이 바로 ES6+ -> ES5 로만 컴파일하던 것이 었습니다.

그리고 이렇게 하는 것은 babel에서 별로 권하질 않습니다. 핵심인 polyfill이 빠져있으니까요.

이제 `targets`를 넣어줍시다.

지정하는 방법은 브라우저별 버전을 직접 명시하는 방법도 있고, market share기준으로 넣는 방법도 있습니다

#### 브라우저 버전 명시

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

#### Market share 기준

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": "> 0.5%, last 2 versions, Firefox ESR, not dead"
      }
    ],
    "@babel/preset-react"
  ]
}
```

- `> 0.5%` : 마켓 쉐어가 0.5% 이상인 브라우저 대상입니다.
- `not dead` : 운영이 중지된것입니다.
- `last 2 versions` : 각 브라우저의 마지막 2개 버전까지가 대상입니다.
- `Firefox ESR` : 파이어폭스가 큰 기관이나 대학에 지원하는 버전입니다. 최신 기능은 지원하지 않으나 안전성, 보안은 업데이트 됩니다.

위에서 쓴 옵션이 `browserlist`의 기본 옵션입니다.
그게 뭐냐고요?

#### browserlist

타겟 브라우저를 `.babelrc`에 적는 방식도 있는데 더 좋은 방식이 있습니다.
support 할 브라우저 버전을 명시해놓고 여러 front-end 툴들이 공유하게 하는 약속같은 파일이 있습니다.
바로 browserlist 입니다.

[browserlist 공식 Github repo](https://github.com/browserslist/browserslist)

여러가지 방식으로 쓸 수 있는데 우리는 `.browserslistrc` 라는 파일로 관리하겠습니다.
설정 파일은 가급적 분리되어있는 파일로 존재하는 것이 역할 scope이 잘 나뉘어지기 때문입니다.

위의 설정을 `.browserslistrc` 파일에 맞게 적으면 아래와 같습니다.

```sh
# Browsers that we support
> 0.5%
last 2 versions
Firefox ESR
not dead
```

기존 `.babelrc` 는 다시 원래대로 두겠습니다.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

다시 컴파일 하여 폴리필이 잘 되는지 확인합시다.
미리 말하지만 안될겁니다..!

마지막 옵션이 있습니다.

#### `@babel/preset-env`의 `useBuiltIns`

`useBuiltIns` 옵션은 `"usage" | "entry" | false` 를 가질 수 있고 기본값은 `false` 입니다.

- `entry` : 엔트리 파일에서 딱 한번 `import "core-js/stable"; import "regenerator-runtime/runtime";`을 선언하면 필요한 컴파일시 `core-js`모듈만을 불러오도록 바꿉니다.
- `usage` : 각 파일별로 딱 필요한 polyfill 만을 불러옵니다. 번들러가 같은 폴리필을 딱 한번만 불러온다는 장점이 있습니다.
- `false` : 사용하지 않습니다? ? ?? ? ?

### `@babel/preset-env`의 `corejs`

`useBuiltIns` 옵션을 `false`외의 값으로 쓸 때 이젠 필수로 명시해야하는 필드입니다.
`core-js`의 버전을 명시해줍니다. 이 문서가 쓰일 때 시점에 바벨 docs에 3.6.5를 쓰는 예시가 있었었고, latest는 3.16.0이었슴다.
저는 3.16.0을 써보겠슴다!

```bash
yarn add core-js@3.16.0
```

`.babelrc`

```json
{
  "presets": [
    ["@babel/preset-env", { "useBuiltIns": "usage", "corejs": "3.16.0" }],
    "@babel/preset-react"
  ]
}
```

다시 컴파일 하여 폴리필이 잘 되는지 확인합시다.

```bash
npx babel src/test.js --out-dir dist
```

```js
// dist/test.js
"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.promise.finally.js");
// ....
```

호오 아주 잘됩니다?
일단 여기까지가 babel까지 적용해본 것이었슴다.
이제 리액트 코드까지 빌드해보져

```bash
npx babel src --out-dir dist
```

```js
// index.js
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));
// ...
```

잘 빌드 되는 것 같은데 index.html을 실행하면 브라우저에서 require 를 찾을 수 없다고 나옵니다.
또 한가지 문제가 있습니다.
`react`는 해당 코드에서 `node_modules`에서 불러오는 형태를 유지하고만 뿐,
웹환경에서 react에 대한 코드는 찾을 수 없습니다.

왜 그럴까요?

### module과 require

바벨은 코드 문법을 컴파일 해주는 도구였습니다. dependency 및 번들링은 생각하지 않습니다. 오로지 문법이나 JSX같은 자바스크립트 표현을 바꿔줄 뿐이죠.

`require`는 CJS(CommonJS) 모듈입니다. 브라우저에서 동작하려면 모듈로더가 필요합니다.

또한 그로부터 불러오는 `react`, `react-dom`같은 패키지들이 브라우저 런타임엔 없습니다.

때문에 이렇게 불러오는 파일을 브라우저에서 가져오는 파일로 만들어주어야 하며, 해당 패키지들의 문법 또한 브라우저가 인식하고 동작할 수 있게 바꾸어야겠죠.

이제 `webpack`이 필요한 때입니다.

## 3. Webpack 필요한 이유 및 설치와 설정

웹팩은 `bundler` 이자 `task runner` 입니다.

- `bundler` : 우리가 module기반으로 작성한 코드들을 production(브라우저) 환경에 배포할 수 있게 만들어주는 도구입니다.
- `task runner` : 말 그대로 일련의 작업들을 실행시켜주는 도구입니다.

### Webpack의 Bundling

하나의 Entry 파일부터 시작해 해당 프로젝트의 dependency graph를 그립니다. 그 뒤 해당 그래프에 따라 필요한 파일들을 번들링합니다.

### Webpack의 Loader

- Webpack은 기본적으로 `JavaScript`, `JSON` 파일을 번들링할 수 있습니다.
- 그 외의 확장자, 타입의 파일들을 모듈로 인식하고 적절한 전략으로 번들링 하기 위해 `loader`가 필요합니다.

#### Loader의 사용법

1. `config.module.rules`에 배열 형태로 `rule`을 전달합니다.
2. 각 `rule`은 다음과 같은 설정항목이 있습니다.

- `test` : 적용할 파일을 지정합니다. 정규표현식을 지원하기 때문에 주로 정규 표현식 형태로 많이 씁니다.
- `use` : `test`에 해당하는 파일에 어떤 로더를 쓸 것인지 배열로 씁니다. 로더의 적용 순서는 배열의 가장 마지막 부터 차례대로 적용됩니다.

예를 들어 `.scss` 파일을 코드에서는 모듈처럼 가져다 쓰고, 빌드시 파일에 포함하기 위해 다음과 같은 로더를 적용했습니다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // style-loader
          { loader: "style-loader" },
          // css-loader
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          // sass-loader
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
```

적용 순서 및 설명

1. `sass-loader`: `.scss`로 끝나는 파일을 만나면 `.css`형식으로 바꿔주는 역할을 합니다.
2. `css-loader`: `.css`로 끝나는 파일을 만나면 `import`한 `path` 또는 `url`을 웹팩의 require로 바꿔줍니다. 오로지 모듈로 인식하게 할뿐, css를 적용하진 않습니다.
3. `style-loader` : `.css`로 불러와지는 모듈을 실제로 html 에 주입(\*Inject CSS into the DOM)시켜주는 역할입니다.

이제 우리 프로젝트에서 `webpack`을 설치하고 번들링할 수 있게 설정해줍시다.

### 설치

일단 `webpack`, `webpack-cli`만 설치해보아요.

```bash
yarn add -D webpack webpack-cli
```

- webpack을 production(브라우저)에서 쓰진않습니다. 우리가 만든 앱을 브라우저에서 동작하도록 번들링 해주는 도구이기에 `-D` 플래그를 이용, `devDependencies`로 설치했습니다.
- `webpack` : `@babel/core` 처럼 웹팩의 기능적인 소스들이 들어있는 패키지입니다.
- `webpack-cli` : `@babel/cli` 처럼 웹팩을 CLI에서 실행할 수 있게 해주는 패키지입니다.

그 뒤 그냥 `npx webpack` 이라고 쳐봅시다.

```
assets by status 331 bytes [cached] 1 asset
./src/index.js 478 bytes [built] [code generated] [1 error]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in ./src/index.js 7:2
Module parse failed: Unexpected token (7:2)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|
| ReactDOM.render(
>   <React.StrictMode>
|     <App />
|   </React.StrictMode>,
```

에러가 뜹니다!

1. mode 를 명시해주어야 합니다. (기본값으로 `production`을 쓰긴합니다)
2. `JSX` 문법을 만나자 `Unexpected token` 에러를 냅니다.

설정값을 더 넣어줘야 합니다!

기본적으로 아무 설정없이 실행하면 `webpack`은

- `entry`로 `./src/index.js`를 삼습니다.
- 번들을 내뿜을 `output`으로 `./dist/main.js`로 삼습니다.

더 나아가기전에 js로만 구성된 파일들 가지고 실험을 해봅시다.

### webpack 테스트

웹팩이 잘동작하는지 테스트하기 위해서 다음과 같은 사항들을 볼겁니다.

1. depth가 다른 여러모듈을 불러올 때 번들링을 어떻게 하는지 살펴본다
2. `node_modules`를 통해 불러온 모듈을 어떻게 처리하는지 살펴본다.

그러기 위해서 다음과 같이 테스트를 준비했습니다.

```js
// 기존 ./src/test.js => ./test/index.js로 변경
// dayjs 설치

// 구조 :
// test
// ├── d1
// │   └── m2.js
// ├── index.js
// └── m1.js

// ./test/index.js
import dayjs from "dayjs";
import { subs, sum } from "./m1";

console.log(subs(1, 2), sum(3, 2), dayjs().format("YYYY-MM-DD"));

// ./test/m1.js
export { sum } from "./d1/m2";
export const subs = (a, b) => a - b;

// ./test/d1/m2.js
export const sum = (a, b) => a + b;
```

이제 다음의 명령어로 번들링해봅시다.

```bash
npx webpack --entry ./test/index.js --mode=production
```

그럼 다음과 같이 생성됩니다.

```
dist
 └── main.js
```

그리고 해당 스크립트를 가져오는 test.html을 만들어 실행해보니 아주 잘 실행이됩니다.
그리고 우리가 `./test/index.js`에서 만든 코드가 다음과 같이 바뀌었습니다.

```js
console.log(subs(1, 2), sum(3, 2), dayjs().format("YYYY-MM-DD"));
// 👇
console.log(-1, 5, n()().format("YYYY-MM-DD"));
```

다음과 같은 결론을 얻을 수 있었습니다.

1. depth가 다른 여러모듈을 불러올 때 번들링을 어떻게 하는지 :
   기본적으로 하나의 파일로 bundling 합니다.
2. `node_modules`를 통해 불러온 모듈을 어떻게 처리하는지 :
   역시 하나의 파일에 포함되게 됩니다.

그래서 코드 스플리팅할 필요성이 생깁니다.

이제 진짜 설정하러 갑시다.

### Webpack 초기 설정

일단 설정 파일부터 만들어봅시다.
`webpack.config.js`를 루트에 생성해주세요.

```js
// ./webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? undefined : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "bundles/index.js"
        : "bundles/chunks/[contenthash].js";
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

#### 설명

- `mode` :

  - `production` : module과 chunk에 대해 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, TerserPlugin 등 플로그인을 적용하여 minify, uglify 된 뭉개진(mangled) 코드로 만들어줍니다.
  - `development` : module과 chunk를 뭉개지 않습니다. 우리가 읽을 수 있게 해줍니다.

- `devtool` :webpack이 소스 코드를 번들로 묶을 때, 오류와 경고의 원래 위치를 추적하기 어렵기 때문에 컴파일된 코드를 원래 소스로 매핑하는 소스맵을 제공하는 옵션입니다. 개발 모드에서만 사용합시다!
- `resolve.extensions` : 확장자를 생략한 import문을 발견 했을 때(e.g. `import App from './App'`) 어느 확장자로 이어서 찾을지 명시해줍니다. 즉 해당 배열안에 넣는 확장자로 된 파일들은 import 시 확장자를 생략하게 할 수도 있습니다. 위의 경우 확장자가 없는 가져오기를 발견했을 때 아래처럼 동작합니다.
  1. `./App.js` 를 찾습니다.
  2. 없으면 `./App.jsx`를 찾습니다.
  3. 없으면 `resolve 할수가 없어 자식아 😡` 라고 빌드시 에러가 납니다.
- `rule.loader`, `rule.use` : 하나의 로더만 쓸 땐 loader를 씁니다. use는 여러 로더를 순서적으로 적용하고 싶을 때 배열로 받아 쓸 수 있습니다.
- `output`

  - `clean`: true일 경우 빌드 시마다 그전 빌드를 지워줍니다.
  - `filename` : 번들 파일의 이름을 지어줍니다. string이거나 function을 쓸 수 있습니다. 또 파일 이름뿐 아니라 output path아래로 경로를 정해줄 수도 있습니다. 저는 여기서 모두 bundles아래로, main 만 index.js 로, 나머지는 chunks로 묶었습니다.
  - `path`: 번들링한 파일들이 내뿜어질 디렉토리를 지정합니다.
  - `publicPath` : 번들링한 파일을 어떤 주소로 접근가능하게 할지 설정합니다. 상대 경로로 쓸 수도 있고, 번들을 cdn에 올린다면, cdn 주소로도 쓸 수 있습니다.

- `HtmlWebpackPlugin` : HtmlWebpackPlugin은 webpack 번들을 제공하는 HTML 파일 생성을 도와줍니다. 우리가 `bundle.js`처럼 고정적인 이름의 번들 하나만 쓴다면 `index.html`에서 해당하는 번들만 잡아주면 되지만, 컴파일 시마다 변경되는 hash filename을 가진 하나 이상의 번들이 생성된다면, 자동으로 html에서 번들을 불러오게끔 해주는 편이 편합니다. 이것을 도와주는 플러그인입니다.

#### optimization 옵션 [참고](https://webpack.js.org/plugins/split-chunks-plugin/#defaults)

중요한 개념이라 따로 뺐습니다.
웹팩은 기본적으로 chunk를 다음과 같은 조건으로 분할합니다.

1. 공유될 수 있는 새로운 청크나, node_modules 폴더 안의 모듈
2. 새로 생기는 청크는 20kb 이상이어야 합니다.
3. (on demand) 병렬적으로 청크 요청이 30개 이하가 되도록
4. (initial page load) 병렬적으로 청크 요청이 30개 이하가 되도록

그러니깐 웹팩 자체에서 브라우저가 가져오는 번들 사이즈와, 개수를 어느정도 고려하고 분할하고 있습니다.
기본값은 다음과 같습니다.

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

`chunk` 옵션은 최적화를 위해 어떤 애덜이 대상이 될 건지 지정합니다.
저는 이옵션에 `all`을 해주었는데, `async`(on demand) , `initial`(initial page load) 둘다 대상이 됩니다.

### 실행 스크립트 만들기 📃

그리고 다음처럼 빌드 스크립트를 써주어 봅시다.

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

이제 `yarn build` 를 통해 빌드를 해보세요!

## 4. Webpack dev server

CRA나 Next.js를 써보셨다면 개발용 서버를 띄웠던 경험이 있을겁니다.
Webpack 설정에서 다음을 추가해서 개발 서버를 띄워봅시다.

```js
// ./webpack.config.js
module.exports = {
  // ...
  devServer: {
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "public/images"),
      path.resolve(__dirname, "public/assets"),
    ],
    contentBasePublicPath: ["/images", "/assets"],
  },
};
```

- `devServer` : 개발 서버 속성입니다. 사실 지정안해도 쓸 수 있습니다. 웹팩이 기본값을 가지고 있거덩요.
  - `port` : 개발 서버 포트를 지정해줍니다.
  - `contentBase` : 정적 파일을 제공하고 싶을 때, 그 정적 파일을 어디서 가져올 지 지시합니다.
  - `contentBasePublicPath`:정적 파일들이 어떤 주소로 접근가능하게 할지 설정합니다.

저는 images와 assets이라는 폴더를 정적 파일을 제공할 수 있게 설정해 둔것입니다. `localhost:3000/images`로 접근가능할거에요.
스크립트에 다음을 추가해주세요.

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

이제 `yarn dev`를 하면 개발서버가 짜잔✨ 하고 열립니다!

### 주의

`webpack-dev-server` 로 개발 서버를 여는 것은
`webapck-cli 4.x`, `webpack 5.x` 버전에서 문제가 생기고 있습니다.
`webpack-dev-server` 로 쓰셨던 분들은 아래처럼 바꾸면 잘 동작합니다.

```sh
# 기존 실행 스크립트
webpack-dev-server
# 이렇게 바꾸면 잘동작합니다.
webpack serve
```

참고 : https://github.com/webpack/webpack-dev-server/issues/2029#issuecomment-707196728

## 5. React에서 Hot Module Replacement 적용

이제 `yarn dev`를 치면! 개발서버가 열리고 확인할 수 있게 되었습니다.

근데 `HMR`은 안되는 것 같습니다? 파일을 고치고 저장해봐도 컴파일은 되는데 브라우저에서 해당 부분만 리로딩하지 않습니다.
`HMR`을 위한 추가 설정이 필요합니다!

### Hot Module Replacement 이란

Hot Module Replacement(이하 HMR)는 모듈 전체를 다시 로드하지 않고 애플리케이션이 실행되는 동안 교환, 추가 또는 제거합니다. 다음의 몇가지 방법으로 개발 속도를 크게 높일 수 있습니다.

- full refresh 중에 손실되는 애플리케이션의 state를 유지합니다.
- 변경된 사항만 갱신합니다.
- 소스코드에서 css/js 를 수정하면 즉시 업데이트합니다. 브라우저 개발자도구에서 직접 변경하는 것과 거의 똑같은 속도!

즉 새로고침 없이, 변경된 스크립트만 개발서버에서 다시 빌드해준 것을 공급해주는 방식이에요. file change가 일어나면, watch하고 있던 녀석이 동작하여 브라우저에게 websocket을 통해 "야 파일 변경됐다 이걸로 다시 받어!" 라고 알려주고 바뀌는 방식입니다.

### React 에서의 HMR

Dan abramov 는 react-hot-loader가 곧 React fast refresh로 대체될 것이라고 했습니다

> React-Hot-Loader is expected to be replaced by React Fast Refresh [원문](https://github.com/gaearon/react-hot-loader)

관련 이슈 : https://github.com/facebook/react/issues/16604

react-fresh라는 이름으로 패키지가 있습니다.

이에 대한 설정을 하려면 컴포넌트 레벨에서도 붙여줘야할게 많아서 따로 플러그인이 있는지 찾아보니 아래와 같습니다.

react-refresh-webpack-plugin : https://github.com/pmmmwh/react-refresh-webpack-plugin

개인 레포인줄 알았는데, CRA로 설치한 것을 eject 했을 때도 포함되어있는 거보니 리액트에서 HMR을 위한 latest한 방식 같습니다.\
그리고 해당 플러그인을 사용하기 위한 리액트, 웹팩 버전이 명시되어있습니다. 최소 React 16.9.0, Webpack 4.43.0 정도는 되어야합니다.

이 플러그인을 통해 React HMR을 적용해봅시다.

1. 패키지를 설치해줍시다.

```bash
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

2. webpack.config.js를 수정해줍시다.

- `babel` 옵션에도 설정을 해주어야 하는데, 환경변수에 따라 다른 설정을 넣어주기 위해 기존 바벨 설정 파일을 json형식에서 js로 바꾸겠습니다. (`.babelrc` => `babel.config.js`).
- 왜인지 모르겠지만, `.browserslistrc` 로 target 브라우저를 설정하는 방식으로 두면 자꾸 HMR적용이 안되었습니다. 해당 설정을 그대로 `babel.config.js`로 이전시키니 잘 동작했습니다. 기존 `.browserslistrc`를 삭제해주세요!
- `development` 모드일때 ReactRefreshWebpackPlugin를 활성화 해줍니다.
- `devServer.hot` : hot reload를 지원하기 위해 devServer에 hot이라는 설정도 추가해줍시다.

```js
// ./webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? undefined : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "bundles/index.js"
        : "bundles/chunks/[contenthash].js";
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "public/images"),
      path.resolve(__dirname, "public/assets"),
    ],
    contentBasePublicPath: ["/images", "/assets"],
    hot: true,
  },
  plugins: [
    !isProd && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

변경된 babel.config.js는 다음과 같습니다.

```js
// ./babel.config.js
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.16.0",
        targets: isProd
          ? "> 0.5%, last 2 versions, Firefox ESR, not dead"
          : "defaults",
      },
    ],
    ["@babel/preset-react", { development: !isProd, runtime: "automatic" }],
  ],
  ...(!isProd && { plugins: ["react-refresh/babel"] }),
};
```

## 6. sass-loader 적용

그냥 css로 작업하는거 너무 힘들죠. 이번엔 css pre-processor중 가장 많이 쓰이는 sass를 적용해볼게요.

rules에서 css 담당 로더를 다음과 같이 바꿉니다.

- 이젠 `.sass, .scss, .css`를 모두 포함합니다.
- 가장먼저 `sass-loader`가 모듈을 relsove 합니다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

이제 다음처럼 scss 모듈을 쓸 수 있습니다.

```js
import styles from "./Count.module.scss";
const Count = () => {
  return (
    <div>
      <div className={styles.count}></div>
      <div className={styles.buttons}></div>
    </div>
  );
};
export default Count;
```

### 먼저 적용할 css 와 나중에 적용할 css(준비중)

훌륭한 ux를 위해서 페이지를 잡아주는 css를 먼저 불러옵시다.
그뒤 필요한 녀석들은 쪼개서 컴포넌트가 필요할 때 불러옵시다.

### 코드 스플리팅 (준비중)

### 타입스크립트 적용 (준비중)

## 그 외 협업을 위해 거의 필수로 필요한 것들 (준비중)

### eslint (준비중)

`.eslintrc` 로 사용

### prettier (준비중)

`.prettierrc` 로 사용
