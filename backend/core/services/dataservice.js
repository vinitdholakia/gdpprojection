const rs = require("../commons/responses");
let log = require("../commons/logger");
const utils = require("../commons/utils");
const api = require("./../commons/api");
let service = {
    getGraphData: (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                let _session = args[0] || {}; // User Session for Logged in User
                let query = args[1] || {}; // filter data
                query.country = query.country || "USA"
                let options = {
                    query: query || {},
                    method: "GET",
                    url: "http://api.worldbank.org/countries/"+query.country+"/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json"
                };
                let data = await api.call(options).catch(err => {
                    return reject(err);
                });
                if (!!data) {
                    return resolve(data);
                } else {
                    return reject(rs.apierror);
                }
            } catch (e) {
                reject(e);
            }
        });
    },
};
let router = {
    getGraphData: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Data Fetched Successfully",
                    code: "DATA"
                }],
                data: data
            })
        };
        service.getGraphData(req.session, req.query).then(successCB, next);
    }
}
module.exports.service = service;
module.exports.router = router;