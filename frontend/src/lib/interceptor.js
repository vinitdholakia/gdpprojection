import axios from 'axios';
import * as constants from './constants'
export default class API {
    call = (options) => {
        return new Promise((resolve, reject) => {
            if (!options.url || !options.method) {
                reject({
                    result: "failure",
                    message: "Missing Parameters"
                });
                return;
            }
            options.url = `${constants.backendServer}${options.url}`;
            axios({
                params: options.query || {},
                headers: options.headers || {
                    'Content-Type': 'application/json'
                },
                data: options.data || {},
                method: options.method,
                url: options.url
            }).then((response) => {
                let data = response.data || {};
                if (data.result === "success") {
                    return resolve(data)
                } else if (data.result === "failure") {
                    return reject({
                        result: "failure",
                        message: (data.response || {}).message || "Some Error with the Server"
                    });
                } else {
                    return reject({
                        result: "failure",
                        message: "Some Error with the Server"
                    });
                }
            }).catch((err) => {
                return reject({
                    result: "failure",
                    message: "Missing Parameters"
                });
            });
        });
    }
}