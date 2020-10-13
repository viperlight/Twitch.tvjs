'use strict';

/**
 * Channel connector queue
 */
class queue {
  /**
   * queue options
   * @param {number} delay - delay time
   */
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
   * @param {?number} index - 
   */
  run(index) {
    index || index === 0 && (this.index = index);
    this.play();
  }

  /**
   * go thro all the queue
   * @returns {void}
   */
  play() {
    const index = this.index++;
    const atPoint = this.queue[index];
    const next = this.queue[this.index];

    if (!atPoint) return;

    atPoint.fn();
    next && setTimeout(() => {
      this.play();
    }, next.delay || this.delay);
  }

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