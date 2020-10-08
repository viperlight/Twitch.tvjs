'use strict';

/**
 * Channel connector queue
 */
class queue {
  constructor(delay) {
    this.queue = [];
    this.index = 0;
    this.delay = delay || 3000; 
  }

  /**
   * add to queue
   * @param {Function} fn - function used wene called queue 
   * @param {number} delay - time used wene called queue
   */
  add(fn, delay) {
    this.queue.push({ fn, delay });
  }
  
  /**
   * playes all the queue
   * @param {number} index - 
   */
  run(index) {
    index === 0 && (this.index = index);
    this.play();
  }

  /**
   * go thro all the queue
   * @returns {void}
   */
  play() {}

  /**
   * resets the timer
   * @returns {void}
   */
  kill() {
    this.index = 0;
    this.queue = [];
  }
}

module.exports = queue;