'use strict';

/**
 * Clients global user
 */
class ClientUser {
  /**
   * @param {Object} data - user data
   */
  constructor(data) {

    /**
     * clients display name
     * @type {string}
     */
    this.username = data['display-name'];

    /**
     * clients id
     * @type {string}
     */
    this.id = data['user-id'];
  }
}

module.exports = ClientUser;
