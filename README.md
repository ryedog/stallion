# Stallion [![Build][build-img]][build-url] [![NPM Downloads][downloads-img]][downloads-url]

> Simple, lightweight way to create promise based Node clients for REST services

Would love some feedback, including how to make the README better. Drop me an email, or create an issue or PR.


Licensed under the MIT-LICENSE

## Readme Todos
1. How authorization works
2. Everything is promise based
3. Get,Delete & Query strings
4. Customer functions & resolving



## Installing
`npm install stallion --save`

## Testing
`npm test` or `gulp test`

You can use `gulp watch` which will run tests on file changes


## Creating a client

Creating a client is simple. Just delcare the objects

```javascript
// Create the API client
//----------------------------------
var config = {
  baseUrl: 'https://api.service.com',
  objects: {
    // Using shortcut declartion for Create, Read, Update & Delete
    User: 'crud',

    // Full object declartion
    Task: {
      actions: 'crud',
      start: function(id) {
        return this.put(`tasks/${id}/start`);
      }
    }
  }
};

var SomeRestApi = new Stallion(config);


// Later, you can create & use an api client instance
//---------------------------------------------------
var api = new SomeRestApi('user', 'pass');

api.createUser({email: 'john.wick@xyz.com'})
.then( user => {
  // Do something with the user
  console.log(user);
})
.catch(e => {
  console.log(e);
});
```

This will create the following methods for Task on the service:

* createTask
* updateTask
* getTask
* deleteTask
* startTask

**NOTE**: May change the configuration before 1.0 release

## Actions
Stallion builds in the common calls REST services for resources: Create, Read, Update (both Put & Patch), and Delete and makes it really easy for you to add them in 2 ways using the objects option in the config:

* Shortcut declaration
```javascript
{
  User: 'crudpl'
}
```

* Using the `action` property on the object description
```javascript
{
  User: {
    actions: 'crudpl'
  }
}
```

There are 5 actions that are available:

* `c` Create: adds a `create<Object>(data)` method which POST's the data to /:objects
* `r` Read: adds a `get<Object>(id)` method which GET's to /:objects/:id
* `u` Update: adds `update<Object>(data)` method which PUT's the param to the service /:objects/:data.id
* `d` Delete: adds `delete<Object>(id)` method which DELETE's to /:objects/:id
* `p` Patch: adds `patch<Object>(data)` method which PATCH's the param to the service /:objects/:data.id
* `l` List: adds a `get<Objects>(query)` method (notice it's plural) which GET's to /:objects but the query object will be translated to a query string

## Custom methods
You can add custom methods to an object by simply adding the function to the objects definition.

```javascript
{
  Lead: {
    convert: function(id) {
      return this.post('lead/' + id + '/convert');
    }
  }
}
```

This will create a `convertLead(id)` method on the service. The provided function will be called in the context of a [Restler](https://github.com/danwrong/restler) client, so you can use any method available that Rester exposes.

## Todos / Thoughts / Comments
1. Convert to full ES6 (originally written in native iojs ES6), now it's transpiled so anyone can use it
2. Add verion (specify header value)
3. Custom function for mapping from Action to HTTP calls
4. Paging
5. Additional authorization options
6. Before / After hooks
7. Exposing array of api methods
8. Shorthand for custom actions
9. Expose request & response objects
10. Add option to create 'client.createResource' vs 'client.resource.create'
11. Wrap Rester's default action method (post, get, etc) to make it easier to send the body & query params
12. Upsert mode - Some API's use POST for create & update. In this case for all updates you need to create a custom update function so would be nice to have way to handle this automatically (1. All updates, 2. single resources)
13. 


[build-img]: https://img.shields.io/codeship/faaed070-00df-0133-d340-46d3771abf46.svg
[build-url]: https://codeship.com/projects/88477
[downloads-img]: http://img.shields.io/npm/dm/stallion.svg
[downloads-url]: https://www.npmjs.com/package/stallion
