var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "id": {
    "type": "string",
    "unique": true,
    "required": true
  },
  "name": {
    "type": "string",
    "required": false
  },
  "phone": {
      "type": "number",
      "minimum": 10,
      "required": false
  },
  "address": {
      "type": "string",
      "required": false
  }
}, { collection: 'users' });

module.exports = mongoose.model('user', userSchema);