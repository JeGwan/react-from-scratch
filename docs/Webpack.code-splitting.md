# Wepack code splitting

코드 스플리팅은 webpack의 가장 매력적인 기능 중 하나입니다. 이 기능을 사용하여 코드를 다양한 번들로 분할하고, 요청에 따라 로드하거나 병렬로 로드할 수 있습니다. 더 작은 번들을 만들고 리소스 우선순위를 올바르게 제어하기 위해서 사용하며, 잘 활용하면 로드 시간에 큰 영향을 끼칠 수 있습니다.

일반적으로 코드 스플리팅은 세 가지 방식으로 접근할 수 있습니다.

- Entry Points: `entry` 설정을 사용하여 코드를 수동으로 분할합니다.
- Prevent Duplication: `Entry dependencies` 또는 `SplitChunksPlugin`을 사용하여 중복 청크를 제거하고 청크를 분할합니다.
- Dynamic Imports: 모듈 내에서 인라인 함수 호출을 통해 코드를 분할합니다.

## 1. Entry Points

코드를 분할하는 가장 쉽고 직관적인 방법입니다.

### 단점

- 손이 많이 갑니다. 매우 수동적으로 다 설정해줘야 되서요.
- 엔트리마다 중복으로 모듈을 가져옵니다.

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

빌드 결과는 다음과 같습니다.

```
[webpack-cli] Compilation finished
asset index.bundle.js 553 KiB [emitted] (name: index)
asset another.bundle.js 553 KiB [emitted] (name: another)
runtime modules 2.49 KiB 12 modules
cacheable modules 530 KiB
  ./src/index.js 257 bytes [built] [code generated]
  ./src/another-module.js 84 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
webpack 5.4.0 compiled successfully in 245 ms
```

위의 설정은 index.js, anoter-module.js를 분리해서 번들링 하지만, 둘다 `loadash`라는 패키지를 불러오고 있을 경우에 각 번들에 중복 삽입됩니다.

## 2. Prevent Duplication

### 2.1. Entry dependencies

Entry Points에서 중복을 제거하려면 dependOn 옵션을 사용하여 청크간 모듈을 공유하게 할 수 있습니다.

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },
    another: {
      import: "./src/another-module.js",
      dependOn: "shared",
    },
    shared: "lodash",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

여러 Entry point를 하나의 html에서 불러온다면 또 한가지 활성화 해주어야 하는 옵션이 있습니다.
다양한 모듈이 특정 모듈을 공유한다고 가정했을 때, 그것이 잘 번들링 되어 하나의 독립적인 script가 될 수도있지만 충분히 많은 곳에서 쓰이지 않는다면 인라인으로 각 모듈에 포함될 수도 있습니다. 그렇다 하더라도 중요한 것은 전역에서 해당 모듈은 오로지 한번만 불러와져야한다는 것입니다.
이를 위해서 필요한 설정이 `runtimeChunk : 'single` 입니다.
오로지 한번만 initialize 되게끔 해주는 것입니다.
이것 까지 추가해보겠습니다.

참고 : [Multiple entry points per page의 문제](https://bundlers.tooling.report/code-splitting/multi-entry/)

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },
    another: {
      import: "./src/another-module.js",
      dependOn: "shared",
    },
    shared: "lodash",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    runtimeChunk: "single",
  },
};
```

이 상태에서 다시 빌드해보면

```
[webpack-cli] Compilation finished
asset shared.bundle.js 549 KiB [compared for emit] (name: shared)
asset runtime.bundle.js 7.79 KiB [compared for emit] (name: runtime)
asset index.bundle.js 1.77 KiB [compared for emit] (name: index)
asset another.bundle.js 1.65 KiB [compared for emit] (name: another)
Entrypoint index 1.77 KiB = index.bundle.js
Entrypoint another 1.65 KiB = another.bundle.js
Entrypoint shared 557 KiB = runtime.bundle.js 7.79 KiB shared.bundle.js 549 KiB
runtime modules 3.76 KiB 7 modules
cacheable modules 530 KiB
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
  ./src/another-module.js 84 bytes [built] [code generated]
  ./src/index.js 257 bytes [built] [code generated]
webpack 5.4.0 compiled successfully in 249 ms
```

`runtime.bundle.js`라는 새로운 녀석이 생겼습니다.
웹팩은 하나의 페이지에서 여러개의 엔트리를 포함하도록 할 수 있지만, 하나의 엔트리가 여러개의 imports를 하는 것은 피해야합니다.

```js
module.exports = {
  // multiple import는 최적화에 좋지 않습니다. 💩
  entry: {
    index: {
      import: ["./src/index.js", "./src/utils.js"],
      dependOn: "shared",
    },
  },
};
```

이를 통해 async script 태그를 불러올 때 더 나은 최적화와 일관된 순서를 지킬 수 있습니다.

### 2.2. SplitChunksPlugin

SplitChunksPlugin을 사용하면 공통 종속성을 기존 항목 청크 또는 완전히 새로운 청크로 추출할 수 있습니다. 이것을 사용하여 이전 예제에서 lodash 종속성을 중복 제거해 보겠습니다.

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

## 3. Dynamic Imports
