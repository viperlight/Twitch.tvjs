const twitch = require('../src/utils/Utils');
const msg = twitch.unpack(':tmi.twitch.tv HOSTTARGET #hosting_channel :- 1000');

console.log(msg);

const [hostingChannel, channelANDCount] = msg.params;
const [channel, count] = channelANDCount.split(' ');
console.log(hostingChannel, channel, count);
