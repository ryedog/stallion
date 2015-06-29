"use strict";

var Stallion = require('../lib/stallion.js');


describe('Instantiate a service', function(){

  var api;
  var service;
  var user = 'my_username';
  var pass = 'my_password';
  var config = {
    baseUrl: 'https://my.api.com',
    objects: {
      'User': 'crud',
      'Company': 'r',
      'Task': {
        actions: 'cru',

      }
    }
  }

  before(function() {
    var service = new Stallion(config);
    api = new service(user, pass);

    // Stub out Restlers get, post, put, delete calls
    sinon.stub(api, 'get').returns()
    sinon.stub(api, 'put').returns()
    sinon.stub(api, 'post').returns()
    sinon.stub(api, 'del').returns()
  });


  it('Sets the baseURL', function(){
    api.baseURL.should.eq(config.baseUrl);
  });

  it('Sets Restlers username & passwords defaults', function() {
    api.defaults.username.should.eq(user);
    api.defaults.password.should.eq(pass);
  });

  describe('When using object shortcut declaration', function() {

    it('Creates all CRUD methods from shortcut declaration is "crud"', function() {
      api.should.respondTo('createUser');
      api.should.respondTo('updateUser');
      api.should.respondTo('deleteUser');
      api.should.respondTo('getUser');
      api.should.respondTo('getUsers');
    });

    it('Creates ONLY read methods when the shortcut is "r"', function() {
      api.should.not.respondTo('createCompany');
      api.should.not.respondTo('updateCompany');
      api.should.not.respondTo('deleteCompany');
      api.should.respondTo('getCompany');
      api.should.respondTo('getCompanies');
    });

  });

  describe('When using full object declaration', function() {

    it('Creates the CRUD methods properly', function() {
      api.should.respondTo('createTask');
      api.should.respondTo('updateTask');
      api.should.not.respondTo('deleteTask');
      api.should.respondTo('getTask');
      api.should.respondTo('getTasks');
    });

  });



  describe('When calling', function(){
    var id = 123;
    var data = {name: 'XYZ'};
    var payload;

    before(function() {
      payload = { data: JSON.stringify(data) };
    })

    describe('createUser', function() {
      it('calls Restlers post method with the object', function() {
        api.createUser(data);
        api.post.should.have.been.calledWith('users', payload);
      });
    });


    describe('deleteUser with an id', function() {
      it('calls Restlers del method with /user/:id as the resource', function() {
        api.deleteUser(id);
        api.del.should.have.been.calledWith('users/' + id);
      });
    });


    describe('getUser with an id', function() {
      it('calls Restlers get method with /user/:id as the resource', function() {
        api.getUser(id);
        api.get.should.have.been.calledWith('users/' + id);
      });
    });


    describe('getUsers with no values', function() {
      it('calls Restlers get method with /user as the resource', function() {
        api.getUsers();
        api.get.should.have.been.calledWith('users');
      });
    });


    describe('getUsers with search params', function() {
      var search = { email: 'abc@gmail.com' };
      var payload = { query: search };
      it('calls Restlers get method with query string params', function() {
        api.getUsers(search);
        api.get.should.have.been.calledWith('users', payload);
      });
    });

  });

});
