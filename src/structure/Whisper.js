const Message = require('./Message');

class Whisper extends Message {
  /**
   * Whisper Message structure
   * @param {Client} client - client instance
   * @param {MessageGatway} message - Message data
   * @param {boolean} self - Whether the message is from client
   */
  constructor(client, message, self = false) {
    super(client, message, self);
  }
}

module.exports = Whisper;

/**
 * @typedef {object} MessageGatway
 * @property {string} [channel]
 * @property {string} content
 * @property {string} [id]
 * @property {Viewer} [author]
 * @property {ChatTypes} type 
 */