'use strict';

class Utils {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * 
   * @param {string} data Mesasge string data 
   * @returns {message}
   */
  static msg(data) {
    const message = {
      raw: data,
      tags: {},
      prefix: null,
      command: null,
      params: [],
    };

    let posit = 0;
    let spaceing = 0;

    if (data.charCodeAt(0) === 64) {
      spaceing = data.indexOf(' ');

      if (spaceing === -1) return null;

      const rawTags = data.slice(1, spaceing).split(';');

      for (let i = 0; i < rawTags.length; i++) {
        const tag = rawTags[i];
        const pair = tag.split('=');
        message.tags[pair[0]] = tag.substring(tag.indexOf('=') + 1) || true;
      }

      posit = spaceing + 1;
    }

    while (data.charCodeAt(posit) === 32) posit++;

    if (data.charCodeAt(posit) === 58) {
      spaceing = data.indexOf(' ', posit);

      if (spaceing === -1) {
        return null;
      }

      message.prefix = data.slice(posit + 1, spaceing);
      posit = spaceing + 1;

      while (data.charCodeAt(posit) === 32) {
        posit++;
      }
    }
    
    spaceing = data.indexOf(' ', posit);

    if (spaceing === -1) {
      if (data.length > posit) {
        message.command = data.slice(posit);
        return message;
      }

      return null;
    }

    message.command = data.slice(posit, spaceing);

    posit = spaceing + 1;

    while (data.charCodeAt(posit) === 32) {
      posit++;
    }

    while (posit < data.length) {
      spaceing = data.indexOf(' ', posit);

      if (data.charCodeAt(posit) === 58) {
        message.params.push(data.slice(posit + 1));
        break;
      }

      if (spaceing !== -1) {
        message.params.push(data.slice(posit, spaceing));
        posit = spaceing + 1;

        while (data.charCodeAt(posit) === 32) {
          posit++;
        }

        continue;
      }

      if (spaceing === -1) {
        message.params.push(data.slice(posit));
        break;
      }
    }
  
    return message;
  }

  /**
   * 
   * @param {string} str channel name
   * @returns {string}
   */
  static properChannel(str) {
    const channel = (str ? str : '').toLowerCase();
    return channel[0] === '#' ? channel : `#${channel}`;
  }
}

module.exports = Utils;