const _ = require("lodash");
const dayjs = require("dayjs");
const obj = require("./common.js");

obj.count++;
console.log("module-b", obj.count);

module.exports = {
  concatObject(a, b) {
    return _.assign({}, a, b);
  },
  format(date) {
    return dayjs(date).format("YYYY-MM-DD");
  },
};
