'use strict';

/**
 * Message emeited structure
 */
class Message {
  constructor(client, message, self = false) {
    /**
     * Client class
     * @type {client}
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * message Viewer data
     * @type {Viewer}
     */
    this.author = message.author;

    /**
     * message channel
     * @type {Channel}
     */
    this.channel = client.channels.get(message.channel);

    /**
     * message content
     * @type {string}
     */
    this.content = message.content;

    /**
     * message id
     * @type {?string}
     */
    this.id = message.id;

    /**
     * Whether the message is from client
     * @type {boolean}
     */
    this.self = self;
  }

  /**
   * reply to a message
   * @param {string | { content: string }} content - reply message
   * @returns {Promise<Message>}
   */
  async reply(content) {
    if (typeof content === 'object') content = content.content;
    await this.channel.send(`@${this.author.username}, ${content}`);
  }
  
  // /**
  //  * delete this message
  //  * @returns {Promise<void>}
  //  */
  // delete() {
  //   return new Promise((resolve, reject) => {
  //     if (!this.id) reject(new Error('Message send by the client cant be deleted with this method'));
  //     let message = Utils.buildMessage(this.client, `/delete ${this.id}`, this.name);
  //     this.client.ws.on(Events_Resolvers.NO_PERMISSIONS, (error) => message = { error });
  //     setTimeout(() => {
  //       if (message instanceof Message) {
  //         resolve();
  //       } else {
  //         reject(message.error);
  //       }
  //     }, 200);
  //   });
  // }
}

module.exports = Message;