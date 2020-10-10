'use strict';

const Utils = require('./Utils');

class CommandManager {
  /**
   * get every thing from client
   * @param {Client} client - base client class 
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {number} delay - time tp excute command
   * @param {string} channel - excution channel
   * @param {string} command - command for excution
   * @param {Promise} fn - command function 
   * @returns {Promise}
   */
  send(delay, channel, command, fn) {
    return new Promise((resolve, reject) => {
      try {
        // make sure the socket is opened
        if (this.client.ws.socket === null || this.client.ws.socket.readyState !== 1)
          // disconnected from server
          throw new Error('Not connected to server');
        else if (typeof delay === 'number') {
          Utils.wait(delay).then(() => { 
            throw new Error('No response from Twitch'); 
          });
        }

        // executing a command on a channel
        if (channel !== null) {
          const Channel = Utils.properChannel(channel);
          // this.client.log.info(`[${chan}] Executing command: ${command}`);
          this.client.ws.socket.send(`PRIVMSG ${Channel} :${command}`);
        // Executing a raw command..
        } else {
          // this.client.log.info(`Executing command: ${command}`);
          this.client.ws.socket.send(command);
        }
        fn(resolve, reject);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = CommandManager;
