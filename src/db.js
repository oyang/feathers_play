const MongoClient = require('mongodb').MongoClient;

// Mock data
const data = require('./data/pipelines.json')
// Load service
const service = require('feathers-mongodb');

module.exports = function (app) {
  // Connect to the db, create and register a Feathers service.
  app.use('/messages', service({
    paginate: {
      default: 20,
      max: 100
    }
  }));

  MongoClient.connect('mongodb://localhost:27017/feathers')
    .then(function(client){
      app.service('messages').Model = client.db('feathers').collection('messages');

      // Now that we are connected, create a dummy Message
      app.service('messages')
        .remove(null)
        .then(message => {
          console.log('Removed message', message.length);
        })
        .then(() => {
          app.service('messages')
             .create(data)
             .then(message => console.log('Created message', message.length))
           }
        );
    }).catch(error => console.error(error));
}
