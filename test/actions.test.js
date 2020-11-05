/* eslint-disable no-console */
// const { pass, user, channels } = require('./auth');
// const tvjs = require('../src');
// const client = new tvjs.Client({
//   channels: channels
// });

// client.login(user, pass);

const tests = [
  () => Math.floor((60000 / (1000) % 60)).toString(),
  () => Math.floor((60000 / (1000))).toString(),
];

for (const test of tests) {
  console.log(test());
}
