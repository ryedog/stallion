# Stallion [![Build](https://img.shields.io/codeship/faaed070-00df-0133-d340-46d3771abf46.svg)]()
Simple way to create clients for REST services in node.

Stallion is written in iojs native es6 with the following flags (project this is for is in iojs)
* `--es_staging`
* `--harmony_arrow_functions`

Planning to throw in a build process to transpile to ES5. Bare with me, wrote this in just a couple of hours.

Would love some feedback, including how to make the README better. Just drop me a line or a PR.


Licensed under the MIT-LICENSE

## Readme Todos
1. How authorization works
2. Everything is promise based
3. Get,Delete & Query strings
4. Customer functions & resolving



## Installing
`npm install stallion --save`

## Creating a client

Creating a client is simple. Just delcare the objects

```javascript
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

var service = new Stallion(config);

service.createUser({email: john.wick@xyz.com})
.then( user => {
  // Do something with the user
});
```

This will create the following methods for Task on the service:

* createTask
* updateTask
* getTask
* getTasks
* deleteTask
* startTask

## Actions
Stallion builds in the common calls REST services for resources: Create, Read, Update (both Put & Patch), and Delete and makes it really easy for you to add them in 2 ways using the objects option in the config:

* Shortcut declaration
```javascript
{
  User: 'crud'
}
```

* Using the `action` property on the object description
```javascript
{
  User: {
    actions: 'crud'
  }
}
```

There are 5 actions that are available:

* `c` Create: adds a `create<Object>(data)` method which POST's the param to /:objects
* `r` Read: adds 2 following methods
  - `get<Object>(id)` method which GET's to /:objects/:id
  - `get<Objects>(data)` method which GET's to /:objects but add the params to the query string
- `u` Update: adds `update<Object>(data)` method which PUT's the param to the service /:objects/:data.id
- `p` Patch: adds `patch<Object>(data)` method which PATCH's the param to the service /:objects/:data.id
- `d` Delete: adds `delete<Object>(id)` method which DELETE's to /:objects/:id


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
1. Add verion (specify header value)
2. Custom function for mapping from Action to HTTP calls
3. Paging
4. Additional authorization options
5. Before / After hooks
6. ES5 version using Babel
7. Exposing array of api methods
8. Shorthand for custom actions
9. Expose request & response objects
10. Add option to create 'client.createResource' vs 'client.resource.create'