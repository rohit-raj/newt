var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  "id": {
    "type": "string",
    "unique": true,
    "required": true
  },
  "name": {
    "type" : "string",
    "required": false
  },
  "unit_price": {
      "type": "number",
      "minimum": 1,
      "required": false
  },
  "description": {
      "type": "string",
      "required": false
  }
}, { collection: 'products' });

module.exports = mongoose.model('product', productSchema);