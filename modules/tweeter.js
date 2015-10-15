/*jshint camelcase: false */

'use strict';

const fs = require('fs');
const Twit = require('twit');

let client;

class Tweeter {
    constructor(api) {
        this.twitter = new Twit(api);
    }

    tweet(file, options) {
        let b64media = fs.readFileSync(file, {
            encoding: 'base64'
        });

        return new Promise((resolve, reject) => {
            this.twitter.post('media/upload', {
                media_data: b64media
            }, (error, data) => {
                if (error) {
                    reject(error);
                }

                var params = {
                    status: `Estiven en ${options.council} e lembreime de ti`,
                    media_ids: [data.media_id_string]
                };

                this.twitter.post('statuses/update', params, function(error, data) {
                    if (error) {
                        reject(error);
                    }


                    client.incr('postalnumber');
                    resolve(data.id_str);
                });
            });

        });
    }
}

module.exports = {
    setClient: (sharedClient) => client = sharedClient,
    Tweeter: Tweeter
};
