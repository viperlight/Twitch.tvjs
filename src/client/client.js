'use strict';

const EventEmitter = require('events');
const { REGEX } = require('../utils/Constants');
const Utils = require('../utils/Utils');
const Storage = require('../structure/Storage');
const ClientWebSocket = require('./websocket/ClientWebSocket');

/**
 * Client, The Main hub point to twitch
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  /**
   * Client options
   * @param {ClientOptions} [options] 
   */
  constructor(options = {}) {
    super();

    /**
     * Client options
     * @type {?ClientOptions}
     */
    this.options = options;

    /**
     * Whether or not to reconnect the client if gets disconnected 
     * @type {boolean}
     */
    this.reconnect = this.options.reconnect || false;

    /**
     * @type {string[]}
     * @private
     */
    this._channels = this.options.channels || [];

    /**
     * chached channel the client hase joined
     * @type {Storage<string, Channel>}
     */
    this.channels = new Storage();

    /**
     * chached viewers the client hase chached during PRIVMSG event
     * @type {Storage<string, Viewer>}
     */
    this.viewers = new Storage();

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * @type {ClientWebSocket}
     */
    this.ws = new ClientWebSocket(this);

    /**
     * whether or not the client is ready
     * @type {boolean}
     */
    this.ready = false;

    /**
     * Client ping rate
     * @type {number}
     */
    this.currentLatency = 0;

    /**
     * Response latency
     * @type {Date}
     */
    this.latency = new Date();

    /**
     * The time the client was ready at
     * @type {?number}
     */
    this.readyAt = null;

    // format all channels
    this.options.channels.forEach((channel, index, array) => {
      array[index] = Utils.properChannel(channel);
    });
  }
  
  /**
   * Connect to twitch
   * @param {string} username - accounts username
   * @param {string} password - accounts auth password
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

/**
 * @typedef {Object} ClientOptions
 * @property {string[]} [channels] - Channel this client will be joining
 * @property {boolean} [reconnect] - Whether or not to reconnect the client if gets disconnected
 */