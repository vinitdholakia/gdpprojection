const rs = require("../commons/responses");
let log = require("../commons/logger");
const utils = require("../commons/utils");
const api = require("./../commons/api");
let service = {
    getGraphData: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {}; // User Session for Logged in User
                let query = args[1] || {}; // filter data
                ressolve([]);
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