const _ = require("lodash");
const uuid = require('uuid');
let service = {};
service.clone = (o) => {
    if (typeof o === "object") {
        return _.clone(o)
    } else {
        return o;
    }
};
service.getUniqueId = () => {
    return uuid.v1();
};
module.exports = service;