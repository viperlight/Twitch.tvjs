'use strict';

/**
 * @extends {Map}
 */
class Storage extends Map {
  /**
   * @param {Function} fn - takes object and reterns something
   * @returns {Array}
   */
  map(fn) {
    const arr = [];
    for (const item of this.values()) {
      arr.push(fn(item));
    }
    return arr;
  }

  /**
   * @param {Function} fn - The finder function
   * @returns {*}
   */
  find(fn) {
    for (const item of this.values()) {
      if (fn(item)) return item;
    }
    return undefined;
  }
}

module.exports = Storage;
