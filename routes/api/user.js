const express   = require('express');
const router    = express.Router();
const async     = require("async");
const uuid      = require("uuid/v4");
var User        = require('../../models/user');
var Product     = require('../../models/product');
var Transaction = require('../../models/transaction');
var response    = require("../../models/response");

router.post('/add', function (req, res) {
    var body = req.body;
    var user = {};
    user.id = uuid();
    user.name = body.name;
    user.phone = body.phone;
    user.address = body.address;
    
    var product = {};
    product.id = uuid();
    product.name = body.transaction.product.name;
    product.description = body.transaction.product.description;
    product.unit_price = body.transaction.product.unit_price;

    var transaction = {};
    transaction.quantity = body.transaction.product.quantity;
    transaction.total_price = parseInt(body.transaction.product.quantity) * parseInt(body.transaction.product.unit_price);

    var tasks = [
        saveUser.bind(null, User, user),
        saveProduct.bind(null, Product, product),
        saveTransaction.bind(null, Transaction, transaction)
    ];

    async.waterfall(tasks, function (err, resp) {
        if(err){
            return response.actionComplete(res, {"err": err});
        }
        response.actionComplete(res, {});
    });
});

function saveUser(User, user, callback){
    var query = {"phone" : user.phone};
    User.findOneAndUpdate(
        query, 
        user,
        {upsert: true, new: true, runValidators: true},
        function (err, doc) {
            if (err) {
                return callback(err);
            }
            var userId = doc._id;
            callback(null, userId);
        }
    );
}

function saveProduct(Product, product, userId, callback){
    var query = {"name": product.name, "description": product.description};
    Product.findOneAndUpdate(
        query, 
        product,
        {upsert: true, new: true, runValidators: true},
        function (err, doc) {
            if (err) {
                return callback(err);
            }
            var userAndProduct = {
                "userId" : userId,
                "productId" : doc._id
            }
            callback(null, userAndProduct);
        }
    );
}

function saveTransaction(Transaction, transaction, userAndProduct, callback){
    transaction.product_id = userAndProduct.productId;
    transaction.user_id = userAndProduct.userId;
    transaction.date = new Date();

    transaction.id = uuid();

    Transaction.create(transaction, function (err, doc) {
        if (err) {
            return callback(err);
        }
        callback();
    });
}

router.get('/user', function (req, res) {
    User.aggregate([
        {
            "$lookup": {
                "from": "transactions",
                "localField": "_id",
                "foreignField": "user_id",
                "as": "latest_transaction_detail"
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": "$name",
                "address":"$address",
                "phone":"$phone",
                "total_transaction":{"$size":"$latest_transaction_detail"},
                "latest_transaction_detail" : "$latest_transaction_detail"
            }
        },
        {
            "$unwind":"$latest_transaction_detail"
        },

        {
            "$project": {
                "name": "$name",
                "address":"$address",
                "phone":"$phone",
                "total_transaction" : {"$sum": 1},
                "_id": 0,
                "latest_transaction_detail" : {
                    "product_id": "$latest_transaction_detail.product_id",
                    "quantity": "$latest_transaction_detail.quantity",
                    "total_price": "$latest_transaction_detail.total_price",
                }
            }
        },
        {
            "$group":{
                "_id": {
                    "_id": "$_id",
                    "phone":"$phone",
                    "name":"$name",
                    "address":"$address",
                    "total_transaction":"$total_transaction"
                  },
                "latest_transaction_detail":{
                    "$last":"$latest_transaction_detail"
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": "$_id.name",
                "phone":"$_id.phone",
                "address":"$_id.address",
                "total_transaction":"$_id.total_transaction",
                "latest_transaction_detail" : "$latest_transaction_detail"
            }
        },

    ],
    function(err, data){
        if(err){
            return response.actionComplete(res, {"err": err});
        }
        response.actionComplete(res, {"data": data});
    });

});


module.exports = router;