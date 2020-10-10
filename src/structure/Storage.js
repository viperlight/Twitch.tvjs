'use strict';

/**
 * @extends {Map}
 */
class Storage extends Map {
  /**
   * @param {*} key - The key to get from this
   * @returns {* | undefined} 
   */
  get(key) {
    return super.get(key);
  }

  /**
   * @param {*} key - The key of what is being add
   * @param {*} value - The value of what is being add
   * @returns {void}
   */
  set(key, value) {
    return super.set(key, value);
  }

  /**
   * @param {*} key - The key to what this is getting
   * @returns {boolean}
   */
  has(key) {
    return super.has(key);
  }

  /**
   * @param {*} key - The key of what is being deleted 
   * @returns {void}
   */
  delete(key) {
    return super.delete(key);
  }

  /**
   * removes everything from this
   * @returns {void}
   */
  clear() {
    return super.clear();
  }

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
}

module.exports = Storage;
