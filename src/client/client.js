'use strict';

const EventEmitter = require('events');
const { REGEX } = require('../utils/Constants');
const Utils = require('../utils/Utils');
const Storage = require('../structure/Storage');
const ClientWebSocket = require('./websocket/ClientWebSocket');

/**
 * Main key point for twitch api
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  constructor(options = {}) {
    super(options);

    /**
     * client options
     * @type {?clientOptions}
     */
    this.options = options;

    /**
     * whether or not to reconnect the client if gets disconnected 
     * @type {boolean}
     */
    this.reconnect = this.options.reconnect || false;

    /**
     * @type {string[]}
     * @private
     */
    this._channels = this.options.channels || [];

    /**
     * @type {Storage}
     */
    this.channels = new Storage();

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * @type {ClientWebSocket}
     * @public
     */
    this.ws = new ClientWebSocket(this);

    /**
     * whether or not the client is ready
     * @type {boolean}
     * @public
     */
    this.ready = false;

    /**
     * Client ping rate
     * @type {number}
     * @public
     */
    this.currentLatency = 0;

    /**
     * @type {Date}
     * @public
     */
    this.latency = new Date();

    /**
     * The time the client was ready at
     * @type {?number}
     * @public
     */
    this.readyAt = null;

    // format all channels
    this.options.channels.forEach((channel, index, array) => {
      array[index] = Utils.properChannel(channel);
    });
  }
  
  /**
   * Connects to twitch server
   * @param {string} username identify data
   * @param {string} password identify data
   * @returns {void}
   */
  login(username, password) {
    const ops = { username, password };
    if (typeof ops.password !== 'string' || !ops.password && 
      typeof ops.username !== 'string' || !ops.username) 
      throw new Error('INVALID_IDENTIFICATION');
    if (!(REGEX.AUTHFORMAT).test(password))
      throw new Error('PASS_MALFORMATTED');
    this.ws.connect(ops);
  }
}

module.exports = Client;
