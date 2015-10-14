/*jshint camelcase: false */

'use strict';

const fs = require('fs');
const Twit = require('twit');

const redis = require('redis');
const client = redis.createClient();

class Tweeter {
    constructor(file, api, options) {
        this.file = file;
        this.twitter = new Twit(api);
        this.options = options;
    }

    tweet() {
        let b64media = fs.readFileSync(this.file, {
            encoding: 'base64'
        });

        return new Promise((resolve, reject) => {
            this.twitter.post('media/upload', {
                media_data: b64media
            }, (error, data) => {
                if (error) {
                    client.end();
                    reject(error);
                }

                var params = {
                    status: `Estiven en ${this.options.council} e lembreime de ti`,
                    media_ids: [data.media_id_string]
                };

                this.twitter.post('statuses/update', params, function(error, data) {
                    if (error) {
                        client.end();
                        reject(error);
                    }

                    client.incr('postalnumber');
                    client.end();
                    resolve(data.id_str);
                });
            });

        });
    }
}

module.exports = Tweeter;
