const Message = require('./Message');
const Utils = require('../utils/Utils');

class Whisper extends Message {
  /**
   * Whisper Message structure
   * @param {Client} client - client instance
   * @param {MessageDataStructures} message - Message data
   * @param {Object} whisperMessage - whisper data
   * @param {boolean} [self=false] - Whether the message is from client
   */
  constructor(client, message, whisperMessage, self = false) {
    super(client, message, self);

    /**
     * @type {string}
     * user id, person sending the message
     */
    this.user_id = whisperMessage['user-id'];

    /**
     * @type {string}
     * whisper channel/chat/dm id
     */
    this.thread_id = whisperMessage['thread-id'];

    /**
     * @type {Object}
     * user badges, other way to get message users badges if author is undefined
     */
    this.user_badges =
      typeof whisperMessage.badges === 'string' ? Utils.badgesResolver(whisperMessage.badges) : undefined;
  }
}

module.exports = Whisper;