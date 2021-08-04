import dayjs from "dayjs";
import { subs, sum } from "./m1";

console.log(subs(10, 2), sum(3, 2), dayjs().format("YYYY-MM-DD"));

console.log("hell2o!!!");

if (module.hot) {
  module.hot.accept();
}
