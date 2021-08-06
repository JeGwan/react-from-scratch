const _ = require("lodash");
const dayjs = require("dayjs");
const obj = require("./common.js");

obj.count++;
console.log("module-a", obj.count);

module.exports = {
  concatObject(a, b) {
    return _.add(a, b);
  },
  format(date) {
    return dayjs(date).format("YYYY");
  },
};
