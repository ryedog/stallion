"use strict";

// TODO: option for service.object.action instad of service.actionObject
// TODO: pluralize vs singular?
var l = console.log;
var restler = require('restler');
var pluralize = require('pluralize');


var shorthandMap = {
  c: 'create',
  r: 'get',
  u: 'update',
  p: 'patch',
  d: 'delete',
  l: 'list',
};

var actionsMap = {
  create: 'post',
  get: 'get',
  update: 'put',
  patch: 'patch',
  list: 'get',
  delete: 'del'
}


class Stallion {


  /**
   * [constructor description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  constructor(config) {

    // Configure Restler
    var restler_config = {
      baseURL : config.baseUrl
    };

    // Create the restler API
    var api = this.buildApi(config);

    var service = restler.service(default_init, restler_config, api);
        service.api = Object.keys(api)
        service.resources = this.objectsToResources(config);
    // TODO: this right
        //service.resources = objects.map(x => { return x.toLowerCase() });

    return service;
  }


  /**
   * [buildApi description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  buildApi(config) {

    if ( config.objects )
      return this.objectsToApi(config);
  }


  objectsToResources(config) {
    return Object.keys(config.objects).map( name => {
      return pluralize(name.toLowerCase());
    });
  }

  /**
   * [objectsToApi description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  objectsToApi(config) {
    var api = {};
    var objs = config.objects;

    for ( var name in objs ) {
      let obj = objs[name];

      // Handle Single line definitions. ex: { User: 'crud' }
      if ( typeof(obj) == 'string' )
        obj = { actions: obj }

      // #es6 Object.assign
      extend(api, this.expandShorthand(name, obj.actions));

      // Handle custom actions
      for (var action in obj )
        if ( action != 'actions' )
          api[action + name] = this.customActionToMethod(obj[action]);

    }

    return api;
  }


  /**
   * [expandActions description]
   * @param  {[type]} name    [description]
   * @param  {[type]} actions [description]
   * @return {[type]}         [description]
   */
  expandShorthand(name, actions) {
    var api = {};

    for (let key in shorthandMap )
      if ( actions.indexOf(key) >= 0 ) {
        var action = shorthandMap[key]
        var method = action + name;
        var resource = pluralize(name.toLowerCase());

        if ( action == 'list' )
          api['get' + pluralize(name)] = this.actionToMethod(resource, action);
        else
          api[method] = this.actionToMethod(resource, action);
      }

    return api;
  }


  /**
   * Handles custom actions by wrapping the custom
   * action into a promise and resolving/rejecting
   * it by adding events to the Reslter request object
   * that is (should be) returned from the custom action
   *
   * @param  {Function} callback The custom action
   * @return {Function}          wrapped function
   */
  customActionToMethod(callback) {

    return function() {
      var self = this;
      var args = arguments;

      return new Promise((resolve, reject) => {

        callback.apply(self, args)
          .on('success', resolve)
          .on('fail', reject)
          .on('error', reject);
      });
    };
  }

  /**
   * [actionToMethod description]
   * @param  {[type]} resource [description]
   * @param  {[type]} action   [description]
   * @return {[type]}          [description]
   */
  actionToMethod(resource, action) {
    var verb = actionsMap[action];


    // Don't use an arrow here
    // This function is called in a differenct context
    // So the self below will be the wrong self
    return function(data, options) {
      var id;
      var route = resource;

      // #es6 default params
      options = options || {};

      if ( can_have_id(action) )
        if ( id = get_id(data) )
          route += '/' + id;
        else
          options['query'] = data;

      else
        options['data'] = JSON.stringify(data)


      // TODO: can we DRY this up with customActionToMethod w/o making unreadable code?
      var self = this;

      return new Promise((resolve, reject) => {

        // l('Calling:', data, verb, route, options);

        var request = self[verb].call(self, route, options)
           .on('success', resolve)
           .on('fail', reject)
           .on('error', reject);
      });

    }
  }

}


/**
 * Simple object extension
 * @param  {Object} o1 Target object
 * @param  {Object} o2 Object to overly onto the target
 */
function extend(o1, o2) {
  for ( var p in o2 )
      o1[p] = o2[p];
}

/**
 * Can the action place an ID in the endpoint?
 * @param  {String}  action
 * @return {Boolean} TRUE if it's a basic action
 */
function can_have_id(action) {
  switch (action) {
    case 'get':
    case 'list':
    case 'delete':
    case 'update':
    case 'patch':
      return true;
  }
  return false;
}

/**
 * Whether the value can be used in the REST endpoint
 * @param  {Mixed}  val
 * @return {Boolean}     TRUE if value can be inserted into the endpoint
 */
function get_id(val) {
  if ( typeof(val) == 'string' || typeof(val) == 'number' )
    return val;

  if ( typeof(val) == 'object' && val.id )
    return val.id;

  return false;
}

/**
 * Default Restler service function
 * @param  {String} user
 * @param  {String} password
 */
function default_init(user, password) {
  this.defaults.username = user;
  this.defaults.password = password;

  this.defaults.headers = {
    Accept: 'application/json'
  }
  this.defaults.headers['Content-Type'] = 'application/json';
}


module.exports = Stallion;