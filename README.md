# Stallion
Simple way to create clients for your REST services in node.

Licensed under the MIT-LICENSE

# Installing
`npm install stallion --save`

# Creating a client

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
```JSON
{
  User: 'crud'
}
```

* Using the `action` property on the object description
```JSON
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

```JSON
{
  Lead: {
    convert: function(id) {
      return this.post('lead/' + id + '/convert');
    }
  }
}
```

This will create a `convertLead(id)` method on the service. The provided function will be called in the context of a [Restler](https://github.com/danwrong/restler) client, so you can use any method available that Rester exposes.
