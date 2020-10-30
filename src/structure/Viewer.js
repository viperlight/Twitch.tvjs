'use strict';

class Viewer {
  constructor(data) {
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
  }
}

module.exports = Viewer;
