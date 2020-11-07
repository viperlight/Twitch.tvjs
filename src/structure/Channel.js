'use strict';

const Utils = require('../utils/Utils');
const { Events } = require('../utils/Constants');
const Storage = require('../structure/Storage');
const Message = require('./Message');

/**
 * Twitch Chat, Room or Channel
 */
class Channel {
  constructor(client, channel) {
    /**
     * channel name
     * @type {string}
     */
    this.name = channel;

    /**
     * Channel id
     * @type {?string}
     */
    this.id = null;

    /**
     * client instance
     * @type {Client}
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * Channel moderators
     * @type {Storage<string, Viewer>}
     */
    this.moderators = new Storage();

    /**
     * Type of chat
     * @type {?string}
     */
    this.chatType = null;

    /**
     * chat subs only mode
     * @type {?boolean}
     */
    this.subs = null;

    /**
     * if message characters of 9 must be unique
     * @type {?boolean}
     */
    this.r9k = null;
  }

  /**
   * Hash sliced name
   * @type {string}
   * @readonly
   */
  get parseName() {
    return this.name.slice(1);
  }

  /**
   * Message that channel
   * @param {string | { content: string }} content - message content
   * @returns {Promise<Message>}
   * @example 
   * <channel>.send('ping').catch(console.log);
   */
  async send(content) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof content === 'object') {
          content = content.content;
        }
        if (content == null || content == undefined)
          throw new Error('Cant send a empty message');

        const message = Utils.buildMessage(this.client, content, this.name);
        if (message instanceof Message)
          this.client.emit(Events.CHAT_MESSAGE, message);
        else {
          throw message.error;
        }
        resolve(message);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * leaves channel
   * @returns {void}
   * @example <channel>.leave();
   */
  leave() {
    this.client.ws.socket.send(`PART ${this.name}`);
    return;
  }
}

module.exports = Channel;
