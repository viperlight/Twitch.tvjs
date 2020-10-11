'use strict';

const Utils = require('../utils/Utils');

class Channel {
  constructor(client, name) {
    /**
     * @type {string}
     */
    this.name = Utils.properChannel(name);

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
  send(content) {
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

        return Utils.buildMessage(this.client, content, this.name).then(() => {
          resolve();
        }).catch(error => {
          throw error;
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = Channel;
