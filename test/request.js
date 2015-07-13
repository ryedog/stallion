'use strict';

/**
 * Simulates a Restler request for testing
 *
 * Allows you to create a request with a specific
 * event, and when that event is added it will
 * invoke that listener
 */
class Request {

  /**
   * @param  {String} The event type for this request
   */
  constructor(event) {
    this.event = event;
  }

  /**
   * Invokes the listener if the Request has the same type
   *
   * @param  {String} The event to add
   * @param  {Callback} The listender
   */
  on(event, listener) {
    if ( this.event === event )
      listener.call();

    return this;
  }
}

module.exports = Request;
