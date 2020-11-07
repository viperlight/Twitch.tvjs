'use strict';

/**
 * Message emeited structure
 */
class Message {
  constructor(client, Viewer, channel, content, self = false) {
    /**
     * Client class
     * @type {client}
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * message Viewer data
     * @type {Viewer}
     */
    this.author = Viewer;

    /**
     * message channel
     * @type {Channel}
     */
    this.channel = client.channels.get(channel);

    /**
     * message content
     * @type {string}
     */
    this.content = content;

    /**
     * Whether the message is from client
     * @type {boolean}
     */
    this.self = self;
  }
}

module.exports = Message;