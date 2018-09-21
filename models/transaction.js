var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
  "id": {
    "type": "string",
    "unique": true,
    "required": true
  },
  "date": {
    "type" : "Date",
    "required": false
  },
  "product_id": {
    "type": "ObjectId",
    "required": false
  },
  "user_id": {
    "type": "ObjectId",
    "required": false
  },
  "quantity": {
    "type": "number",
    "minimum": 1,
    "required": false
  },
  "total_price": {
    "type": "number",
    "minimum": 1,
    "required": false
  }
}, { collection: 'transactions' });

module.exports = mongoose.model('transaction', transactionSchema);