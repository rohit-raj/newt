const fs    = require("fs");
const config    = require("config");
const path  = "/newt/";

module.exports = function(app) {
    const addRoute = function(directory, file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        const name = file.substr(0, file.indexOf('.'));
        app.use(path, require(directory + name));
    };

    fs.readdirSync("./routes/api").forEach(addRoute.bind(null, './api/'));
};