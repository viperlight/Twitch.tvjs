const Message = require('./Message');
const Utils = require('../utils/Utils');

/**
 * Whisper Message structure
 * @extends {Message}
 */
class Whisper extends Message {
  /** 
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

  /**
   * Replay to a whisper message
   * @param {string | { content: string }} content - content beeing sent
   */
  reply(content) {
    if (typeof content === 'object') content = content.content;
    this.client.ws.send(`PRIVMSG #twitchjs:/w ${typeof this.author === 'string' ? this.author : this.author.username} ${content}`);
  }
}

module.exports = Whisper;