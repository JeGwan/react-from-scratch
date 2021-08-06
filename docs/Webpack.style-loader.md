# style-loader

DOM에 스타일을 주입해줍니다.

## 설치 및 이용법

```css
/* style.css */
body {
  background: green;
}
```

```js
/* component.js */
import "./style.css";
```

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

이렇게 하면 css-loader를 통해 `import "./style.css"` 구문을 모듈로 인식하고, 해당 스타일을 DOM에 삽입해주는 역할을 style-loader가 해줍니다.

## injectType 옵션

DOM에 삽입은 어떻게 될까요?
`injectType` 설정을 이용할 수 있습니다.
아래처럼 설정해줄 수 있구요.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader", options: { injectType: "styleTag" } },
          "css-loader",
        ],
      },
    ],
  },
};
```

설정할 수 있는 값은 다음과 같습니다.

- `styleTag`
- `singletonStyleTag`
- `autoStyleTag`
- `lazyStyleTag`
- `lazySingletonStyleTag`
- `lazyAutoStyleTag`
- `linkTag`

### styleTag

기본 적용값입니다.
모듈 별로 `<style></style>`를 이용해서 DOM에 주입시켜줍니다.

```html
<!-- example -->
<style>
  .foo {
    color: red;
  }
</style>
<style>
  .bar {
    color: blue;
  }
</style>
```

캐싱이 되지않아서 좋은 방법은 아닙니다!

### singletonStyleTag

하나의 style 태그에 몽땅 넣습니다.

```html
<style>
  .foo {
    color: red;
  }
  .bar {
    color: blue;
  }
</style>
```

### autoStyleTag

`styleTag`랑 같은데, IE6-9에서는 `singletonStyleTag`로 동작합니다.

### lazyStyleTag

`<style></style>`를 필요할 때 넣어줍니다. lazy일 경우 `.lazy.css`로 네이밍 컨벤션을 지킬것을 추천하고 있습니다.
그렇지 않은 일반적인 경우 `.css`로 하시면됩니다.

사용법

1. 특별한 확장자로 고정시켜주세요
2. `styles.use`로 컴포넌트에선 사용해주세요
3. `webpack` 로더에서 설정을 추가해주세요(아래 참고!)

```js
// component.js
import styles from "./styles.lazy.css";

styles.use();

const divElement = document.createElement("div");
divElement.className = styles.locals["my-class"];

// For removing styles you can use
// styles.unuse();
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.lazy\.css$/i,
        use: [
          { loader: "style-loader", options: { injectType: "lazyStyleTag" } },
          "css-loader",
        ],
      },
    ],
  },
};
```

로더는 스타일을 다음처럼 주입해줍니다.

```html
<style>
  .foo {
    color: red;
  }
</style>
<style>
  .bar {
    color: blue;
  }
</style>
```

## lazySingletonStyleTag

위랑 똑같은데 여러 lazy.css를 하나의 스타일 태그로 묶습니다.

## lazyAutoStyleTag

`lazyStyleTag`랑 같은데, IE6-9에서는 `lazySingletonStyleTag`로 동작합니다.

## linkTag

DOM에 여러개의 `<link rel="stylesheet" href="path/to/file.css">`로 주입시킵니다.

로더는 스타일을 다음처럼 주입해줍니다.

```html
<link rel="stylesheet" href="path/to/style.css" />
<link rel="stylesheet" href="path/to/other-styles.css" />
```

## insert 옵션

`<style>` 또는 `<link>` 태그를 주입시킬 태그를 가리킬 수 있습니다.
기본 값은 head에 넣어집니다.

## 한계

production 환경에서는
사실 caching을 위해서는 `linkTag`를 써야합니다. 큰 윤곽은 head 태그에 넣어서 잡고, 페이지별로 필요한 것은 lazy하게 불러오고 싶습니다.
또한 js, css 자원을 병렬적으로 가져오기 위한 니즈도 있습니다.
이 때문에 style-loader 설명에 권장하는 방식이 `mini-css-extract-plugin`을 함께 쓰는 것입니다.
이것이 분리된 여러개의 css 파일을 만들어주기 때문입니다.
