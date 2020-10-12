'use strict';

const Utils = require('../utils/Utils');

class Channel {
  constructor(client, channel) {
    /**
     * @type {string}
     */
    this.name = channel;

    /**
     * @type {Client}
     */
    this.client = client;
  }

  /**
   * @returns {string}
   */
  get parseName() {
    return this.name.slice(1);
  }

  /**
   * @param {string} content - message content
   * @returns {Promise<void>}
   */
  async send(content) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof content === 'object') {
          content = content.content;
        }
        if (content == null || content == undefined)
          throw new Error('Cant send a empty message');
        
        if ((content.startsWith('.') && !content.startsWith('..')) || content.startsWith('/') || content.startsWith('\\')) {
          // check of message is a action
          if (content.substr(1, 3) === 'me ') {
            return this.client._commands.action(this.name, content.substr(4));
          } else {
            // send message
            return this.client._commands.send(this.client._time, this.name, content);
          }
        }

        Utils.buildMessage(this.client, content, this.name).catch(error => {
          throw error;
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = Channel;
