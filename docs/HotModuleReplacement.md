# Hot Module Replacement 구현

Hot Module Replacement(이하 HMR)는 webpack에서 제공하는 가장 유용한 기능 중 하나입니다. 모든 종류의 모듈을 새로고침 할 필요 없이 런타임에 업데이트 할 수 있습니다.

> HMR은 프로덕션용이 아니므로 개발용으로만 사용합시다!

## Enabling HMR

사용법은 `webpack-dev-server` 설정을 업데이트하고 내장 HMR 플러그인을 사용하면 끄읏!

웹팩 설정에서 다음을 추가해줍시다.

```js
module.exports = {
  // ...
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
  // ...
};
```

# Hot Module Replacement 개념

Hot Module Replacement(이하 HMR)는 모듈 전체를 다시 로드하지 않고 애플리케이션이 실행되는 동안 교환, 추가 또는 제거합니다. 다음의 몇가지 방법으로 개발 속도를 크게 높일 수 있습니다.

- full refresh 중에 손실되는 애플리케이션의 state를 유지합니다.
- 변경된 사항만 갱신합니다.
- 소스코드에서 css/js 를 수정하면 즉시 업데이트합니다. 브라우저 개발자도구에서 직접 변경하는 것과 거의 똑같은 속도!
