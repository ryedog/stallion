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
  d: 'delete'
};

var actionsMap = {
  create: 'post',
  get: 'get',
  update: 'put',
  patch: 'patch',
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


  /**
   * [objectsToApi description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  objectsToApi(config) {
    var api = {
      resources: []
    };
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
          api[action + name] = obj[action];

      api.resources.push( pluralize(name.toLowerCase()) );
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

        api[method] = this.actionToMethod(resource, action);

        // Add list/search function
        if ( action == 'get' )
          api[action + pluralize(name)] = this.actionToMethod(resource, action);

      }

    return api;
  }


  /**
   * [actionToMethod description]
   * @param  {[type]} resource [description]
   * @param  {[type]} action   [description]
   * @return {[type]}          [description]
   */
  actionToMethod(resource, action) {
    var verb = actionsMap[action];


    return (data, options) => {
      var id;
      // #es6 default params
      options = options || {};

      if ( can_have_id(action) )
        if ( id = get_id(data) )
          resource += '/' + id;
        else 
          options['query'] = data;

      else
        options['data'] = JSON.stringify(data)


      var self = this;

      return new Promise((resolve, reject) => {

        //l('Calling:', verb, resource, options);

        self[verb].call(self, resource, options)
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