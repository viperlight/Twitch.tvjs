const Message = require('./Message');
const Utils = require('../utils/Utils');
// const { Events } = require('../utils/Constants');

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
     * @type {?string}
     * user id, person sending the message
     */
    this.user_id = whisperMessage['user-id'];

    /**
     * @type {?string}
     * whisper channel/chat/dm id
     */
    this.thread_id = whisperMessage['thread-id'];

    /**
     * @type {Object}
     * user badges, other way to get message users badges if author is undefined
     */
    this.user_badges = typeof whisperMessage.badges === 'string' ? Utils.badgesResolver(whisperMessage.badges) : {};
  }

  /**
   * Replay to a whisper message
   * @param {string | { content: string }} content - content beeing sent
   * @example
   * whisper.reply('hello').catch(console.log);
   */
  async reply(content) {
    if (typeof content === 'object') content = content.content;
    this.client.ws.send(`PRIVMSG #twitchjs:/w ${typeof this.author === 'string' ? this.author : this.author.username} ${content}`);
    // const msg = Utils.buildWMessage(
    //   this.client,
    //   `/w ${typeof this.author === 'string' ? this.author : this.author.username} ${content}`,
    //   '#twitchjs'
    // );
    // console.log(msg);
    // return Promise((resolve, reject) => {
    //   try {
    //     if (typeof content === 'object') content = content.content;
    //     if (content == null || content == undefined) throw new Error('Cant send a empty message');

    //     const msg = Utils.buildWMessage(
    //       this.client,
    //       `/w ${typeof this.author === 'string' ? this.author : this.author.username} ${content}`,
    //       '#twitchjs'
    //     );
    //     if (msg instanceof Message) {
    //       this.client.emit(Events.WHISPER, msg);
    //     } else {
    //       throw msg.error;
    //     }
    //     resolve(msg);
    //   } catch (error) {
    //     reject(error);
    //   }
    // });
  }
}

module.exports = Whisper;
