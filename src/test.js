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
