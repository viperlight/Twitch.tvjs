'use strict';

const Utils = require('../utils/Utils');

class Viewer {
  constructor(client, data) {
    /**
     * The client that instantiated this
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * viewer display name
     * @type {string}
     */
    this.username = data['display-name'];

    /**
     * viewer id
     * @type {string}
     */
    this.id = data['user-id'];

    /**
     * Whether the viewer is mod
     * @type {boolean}
     */
    this.mod = data.mod == '1' ? true : false;

    /**
     * viewers channel color id
     * @type {?string}
     */
    this.color = data.color;

    /**
     * viewers chat badges 
     * @type {string}
     */
    this.badges = data.badges;

    /**
     * Whether the viewer is a subscriber
     * @type {boolean}
     */
    this.subscriber = data.subscriber == '1' ? true : false;

    /**
     * The channel of the viewer
     * @type {Channel}
     */
    this.channel = client.channels.get(data.channel);
  }

  /**
   * ban this Viewer from chat
   * @param {string} [reason] - ban reason
   * @returns {Promise<Viewer>}
   */
  ban(reason) {
    return new Promise((resolve, reject) => {
      if (reason && typeof reason !== 'string') throw new Error('Parameter "reason" must be string');
      const msg = Utils.buildMessage(this.client, `/ban ${this.username} ${reason}`, this.channel.name);
      if (!msg.error) {
        resolve(this);
      } else reject(msg.error);
    });
  }

  /**
   * Timeout this viewer
   * @param {string} [time='1h'] - timeout time for viewer
   * @returns {Promise<void>}
   */
  timeout(time = '1h') {
    return new Promise((resolve, reject) => {
      if (time && typeof time !== 'string') throw new Error('Parameter "time" must be string');
      const msg = Utils.buildMessage(this.client, `/timeout ${this.username} ${time}`, this.channel.name);
      if (!msg.error) {
        resolve(this);
      } else reject(msg.error);
    });
  }
}

module.exports = Viewer;
