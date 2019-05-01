var request = require("request");
const rs = require("./responses");
let utils = require("./utils");
var rest = {}
rest.call = (options) => {
    return new Promise((resolve, reject) => {
        try {
            if (!options.url || !options.method) {
                reject(rs.invalidrequest);
                return;
            };
            request({
                qs: options.query || {},
                headers: options.headers || {},
                data: options.data || {},
                method: options.method,
                url: options.url
            }, function (error, response, body) {
                if (error) return reject(rs.apierror);;
                return resolve(JSON.parse(body));
            })
        } catch (error) {
            return reject(rs.apierror);
        }
    });
}
module.exports = rest;