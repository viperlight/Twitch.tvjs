'use strict';

class ClientUser {
  constructor(data) {

    /**
     * @private
     */
    this.data = data;

    /**
     * clients display name
     * @type {string}
     */
    this.username = this.data['display-name'];

    /**
     * clients id
     * @type {string}
     */
    this.id = this.data['user-id'];
  }
}

module.exports = ClientUser;