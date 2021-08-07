import { fromEvent } from ("rxjs"); 
const validator = require("validator");

fromEvent(document.querySelector(".my-button"), "click").subscribe(() =>
  console.log("clicked!")
);

console.log({ isEmail: validator.isEmail("emperorv@naver.com") });

module.exports = {};
