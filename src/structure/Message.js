'use strict';

/**
 * Message emeited structure
 * @class {Message}
 */
class Message {
  constructor(client, user, channel, content, self = undefined) {
    // super(client);

    /**
     * Client class
     * @type {client}
     */
    this.client = client;

    /**
     * message use data
     * @type {User}
     */
    this.author = user;

    /**
     * message channel
     * @type {string}
     */
    this.channel = client.channels.get(channel);

    /**
     * message content
     * @type {string}
     */
    this.content = content;

    /**
     * if message is from client
     * @type {?boolean}
     */
    this.self = self;
  }
}

module.exports = Message;