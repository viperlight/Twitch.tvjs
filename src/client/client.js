'use strict';

const EventEmitter = require('events');
const { REGEX, Events, Events_Resolvers } = require('../utils/Constants');
const Utils = require('../utils/Utils');
const Storage = require('../structure/Storage');
const ClientWebSocket = require('./websocket/ClientWebSocket');

/**
 * The Main hub point to twitch
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  /**
   * @param {ClientOptions} [options] - Options for the client
   */
  constructor(options = {}) {
    super();
    this._setListenersCount();

    /**
     * Options for the client
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
    if (this.options.channels && this.options.channels.length > 0) {
      this.options.channels.forEach((channel, index, array) => {
        array[index] = Utils.properChannel(channel);
      });
    }
  }
  
  /**
   * Connect to twitch with the username and account auth token
   * @param {string} username - accounts username
   * @param {string} password - accounts auth token
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

  /**
   * Client join new channel
   * @param {string} channel - Name of the channel to join 
   * @returns {void}
   */
  joinChannel(channel) {
    channel = Utils.properChannel(channel);
    this.ws.send(`JOIN ${channel}`);
  }

  /**
   * Sets the amount of listeners
   * @private
   */
  _setListenersCount() {
    const _eventsLength = Object.keys(Events).length + Object.keys(Events_Resolvers).length;
    this.setMaxListeners(_eventsLength);
  }
}

module.exports = Client;

/**
 * @typedef {Object} ClientOptions
 * @property {string[]} [channels] - Channel this client will be joining
 * @property {boolean} [reconnect] - Whether or not to reconnect the client if gets disconnected
 */