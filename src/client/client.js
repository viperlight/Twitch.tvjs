'use strict';

const EventEmitter = require('events');
const Utils = require('../utils/Utils');
const ClientWebSocket = require('./websocket/ClientWebSocket');
const CommandManager = require('../utils/CommandManager');

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
     * User that the client is logged in as
     * @type {?string}
     */
    this.username = null;

    /**
     * @type {ClientWebSocket}
     * @private
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

    /**
     * @type {CommandManager}
     * @private
     * @readonly
     */
    this._commands = new CommandManager(this);

    // format all channels
    this.options.channels.forEach((channel, index, array) => {
      array[index] = Utils.properChannel(channel);
    });
  }
  
  /**
   * Connects to twitch server
   * @param {connectionOptions} ops identify data
   * @returns {void}
   */
  login(ops) {
    if (typeof ops !== 'object' || !ops) throw new Error('INVALID_IDENTIFICATION');
    if (typeof ops.password !== 'string' || !ops.password && 
      typeof ops.username !== 'string' || !ops.username) throw new Error('INVALID_IDENTIFICATION-DATA');
    try {
      this.ws.connect(ops);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @private
   * @returns {number}
   */
  get _time() {
    if (this.currentLatency <= 600) return 600;
    else return this.currentLatency + 100;
  }

  /**
   * Client joins a channel for events/Actions
   * @param {string} channel - channel name to join 
   * @returns {Promise<void>}
   */
  join(channel) {
    if (!channel || typeof channel !== 'string') 
      throw new Error('INVALID_CHANNEL_TYPE');
    channel = Utils.properChannel(channel);
    // excute a join command for channel
    return this._commands.send(null, null, `JOIN ${channel}`, (resolve, reject) => {
      const eventName = 'voidJoin_0';
      let hasFulfilled = false;
      const listener = (err, joinedChannel) => {
        if (channel === Utils.properChannel(joinedChannel)) {
          // received event target, resolve or reject
          this.removeListener(eventName, listener);
          hasFulfilled = true;
          if (!err) resolve([channel]);
          else reject(err);
        }
      };
      this.on(eventName, listener);
      // race the Promise against a delay
      const delay = this._time;
      Utils.wait(delay).then(() => {
        if (!hasFulfilled) {
          this.emit(eventName, 'No response from Twitch', channel);
        }
      });
    });

  }

  /**
   * Channels the client was assigned to 
   * @returns {string[]}
   * @readonly
   */
  get channels() {
    return this.options.channels || [];
  }
}

module.exports = Client;
