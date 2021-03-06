'use strict';

var Stallion = require('../lib/stallion.js')
  , Request  = require('./request.js');


describe('Instantiate a service', function(){

  var client;
  var Service;
  var user = 'my_username';
  var pass = 'my_password';
  var config = {
    baseUrl: 'https://my.client.com',
    objects: {
      User: 'crudlp',
      Company: 'r',
      Task: {
        actions: 'cru',
        finish: function() {
          return this.put('tasks/finish');
        }
      }
    }
  };


  before(function() {
    Service = new Stallion(config);
    client = new Service(user, pass);

    // Stub out Restlers get, post, put, delete calls
    sinon.stub(client, 'get').returns( new Request('success') );
    sinon.stub(client, 'put').returns( new Request('success') );
    sinon.stub(client, 'post').returns( new Request('error') );
    sinon.stub(client, 'patch').returns();
    sinon.stub(client, 'del').returns();
  });


  it('Sets the baseURL', function(){
    client.baseURL.should.eq(config.baseUrl);
  });

  it('Sets Restlers username & passwords defaults', function() {
    client.defaults.username.should.eq(user);
    client.defaults.password.should.eq(pass);
  });

  it('Creates custom functions on the service', function() {
    client.should.respondTo('finishTask');
  });

  it('Returns a promise for added methods', function() {
    client.getUser().should.be.instanceof(Promise);
  });

  it('On success fulfills the request', function() {
    return client.getTask().should.be.fulfilled;
  });

  it('On error rejects the request', function() {
    return client.createUser().should.be.rejected;
  });

  it('Set the api methods on the service', function() {
    Service.api.should.have.length(11);
  });

  it('Set the available resources on the service', function() {
    Service.resources.should.have.length(3);
    Service.resources.should.include.members(['users', 'companies', 'tasks']);
  });

  describe('When creating multiples instances of a service', function() {
    var client2;
    var other_user = 'different_username';

    before(function() {
      client2 = new Service(other_user, pass);
    });

    // Restler's service will share the username/password across multiple
    // instances so we need to create a new service for each instance
    // of a service we want to create
    it('each service has their own username & password', function() {
      client.defaults.username.should.eq(user);
      client2.defaults.username.should.eq(other_user);
    });
  });


  describe('When using object shortcut declaration', function() {

    it('Creates all CRUD methods when shortcut declaration is "crudpl"', function() {
      client.should.respondTo('createUser');
      client.should.respondTo('updateUser');
      client.should.respondTo('patchUser');
      client.should.respondTo('deleteUser');
      client.should.respondTo('getUser');
      client.should.respondTo('getUsers');
    });

    it('Creates ONLY read methods when the shortcut is "r"', function() {
      client.should.not.respondTo('createCompany');
      client.should.not.respondTo('updateCompany');
      client.should.not.respondTo('deleteCompany');
      client.should.respondTo('getCompany');
      client.should.not.respondTo('getCompanies');
    });

  });

  describe('When using full object declaration', function() {
    it('Creates the CRUD methods properly', function() {
      client.should.respondTo('createTask');
      client.should.respondTo('updateTask');
      client.should.not.respondTo('deleteTask');
      client.should.respondTo('getTask');
      client.should.not.respondTo('getTasks');
    });
  });

  describe('When calling', function(){
    var id = 123;
    var data = {id: 123, name: 'XYZ'};
    var payload;

    before(function() {
      payload = { data: JSON.stringify(data) };
    });

    describe('createUser', function() {
      it('calls Restlers post method with the object', function() {
        client.createUser(data);
        client.post.should.have.been.calledWith('users', payload);
      });
    });


    describe('updateUser', function() {
      it('calls Restlers put method with /user/:id as the resource', function() {
        client.updateUser(data);
        client.put.should.have.been.calledWith('users/' + id);
      });
    });

    describe('patchUser', function() {
      it('calls Restlers patch method with /user/:id as the resource', function() {
        client.patchUser(data);
        client.patch.should.have.been.calledWith('users/' + id);
      });
    });

    describe('deleteUser with an id', function() {
      it('calls Restlers del method with /user/:id as the resource', function() {
        client.deleteUser(id);
        client.del.should.have.been.calledWith('users/' + id);
      });
    });
    describe('getUser with an id', function() {
      it('calls Restlers get method with /user/:id as the resource', function() {
        client.getUser(id);
        client.get.should.have.been.calledWith('users/' + id);
      });
    });


    describe('getUsers with no values', function() {
      it('calls Restlers get method with /user as the resource', function() {
        client.getUsers();
        client.get.should.have.been.calledWith('users');
      });
    });


    describe('getUsers with search params', function() {
      var search = { email: 'abc@gmail.com' };
      var payload2 = { query: search };
      it('calls Restlers get method with query string params', function() {
        client.getUsers(search);
        client.get.should.have.been.calledWith('users', payload2);
      });
    });


    describe('a custom function, say finishTask', function() {
      var promise;
      before(function() {
        promise = client.finishTask(1, 2, 3);
      });

      it('calls Restlers put method with the resource /tasks/finish', function() {
        client.put.should.have.been.calledWith('tasks/finish');
      });

      it('returns a promise', function() {
        promise.should.be.instanceof(Promise);
      });

      it('and that promise resolves', function() {
        return promise.should.be.fulfilled;
      });
    });

  });

});
