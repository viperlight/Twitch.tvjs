'use strict';

const Utils = require('../utils/Utils');
const { Events, Events_Resolvers, ERRORS_MSG } = require('../utils/Constants');
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
     * @type {?ChatTypes}
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
   * Unbans a viewer from this channel
   * @param {string} username - Viewer being unban for this channel
   * @returns {Promise<void>}
   */
  unban(username) {
    return new Promise((resolve, reject) => {
      if (typeof username !== 'string') throw new Error(ERRORS_MSG.MUST_BE('username', 'string'));
      let message = Utils.buildMessage(this.client, `/unban ${Utils.properUsername(username)}`, this.name);
      this.client.ws.on(Events_Resolvers.VIEWER_UNBAN_ERROR, (error) => message = { error });
      this.client.ws.on(Events_Resolvers.VIEWER_UNBAN_SUCCESS, () => {
        this.client.emit(Events.VIEWER_UNBAN, this);
      });
      setTimeout(() => {
        if (message instanceof Message) {
          resolve();
        } else {
          reject(message.error);
        }
      }, 200);
    });  
  }

  /**
   * Clear all messages in chat
   * @returns {Promise<Channel>}
   */
  clear() {
    return new Promise((resolve, reject) => {
      let message = Utils.buildMessage(this.client, '/clear', this.name);
      this.client.ws.on(Events_Resolvers.NO_PERMISSIONS, (error) => message = { error });
      setTimeout(() => {
        if (message instanceof Message) {
          resolve(this);
        } else {
          reject(message.error);
        }
      }, 200);
    });
  }

  /**
   * Delete message(s) from channel
   * @param {string | string[]} messageID - id of message to delete
   * @returns {Promise<void>}
   */
  deleteMessages(messageID) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(messageID)) {
        for (const ID of messageID) {
          let message = Utils.buildMessage(this.client, `/delete ${ID}`, this.name);
          this.client.ws.on(Events_Resolvers.NO_PERMISSIONS, (error) => message = { error });
          this.client.ws.on(Events_Resolvers.MESSAGE_DELETE_ERROR, (error) => message = { error });
          setTimeout(() => {
            if (message instanceof Message) {
              resolve();
            } else {
              reject(message.error);
            }
          }, 200);
        }
      } else if (typeof messageID === 'string') {
        let message = Utils.buildMessage(this.client, `/delete ${messageID}`, this.name);
        this.client.ws.on(Events_Resolvers.NO_PERMISSIONS, (error) => message = { error });
        this.client.ws.on(Events_Resolvers.MESSAGE_DELETE_ERROR, (error) => message = { error });
        setTimeout(() => {
          if (message instanceof Message) {
            resolve();
          } else {
            reject(message.error);
          }
        }, 200);
      } else {
        reject(new Error(ERRORS_MSG.MUST_BE('messageID', 'string or string array'))); 
      }
    });
  }

  /**
   * leaves channel
   * @returns {void}
   * @example <channel>.leave();
   */
  leave() {
    this.client.ws.send(`PART ${this.name}`);
    return;
  }
}

module.exports = Channel;

/**
 * @typedef {'any' | 'followers' | 'followerWait'} ChatTypes
 */