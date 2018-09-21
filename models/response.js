exports.actionFailed = function (res, data) {
    var response = {
        status      : 121,
        message     : 'Failed',
        data        : data
    };
    res.send(response);
};

exports.actionComplete = function (res, data) {
    var response = {
        status      : 200,
        message     : 'Ok',
        data        : data
    };
    res.send(response);
};
