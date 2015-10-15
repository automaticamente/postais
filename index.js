'use strict';

const fs = require('fs');
const redis = require('redis');

const Loader = require('./modules/loader');
const builder = require('./modules/builder');
const tweeter = require('./modules/tweeter');

const client = redis.createClient();

builder.setClient(client);
tweeter.setClient(client);

const h = require('./modules/helpers');

const config =
    fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');

const T = new tweeter.Tweeter(config.twitterAPI);

const nomenclator = require('./nomenclator.json');

const build = function() {
    let place = h.choice(nomenclator);

    let url = `https://maps.googleapis.com/maps/api/streetview?size=640x440&location=${encodeURI(place.place)}, ${encodeURI(place.council)},Spain&fov=${h.randint(90,120)}&heading=${h.randint(0,360)}&pitch=0&key=AIzaSyAnR2CI3d6MUBrU6E9LU2FqbMVZ7XVAj-Y`;

    new Loader(url, config.download).load()
        .then(file => new builder.Builder(file, config.output, {
            font: config.font,
            stamp: h.choice(config.stamps),
            council: place.council,
            place: place.place
        }).build())
        .then(file => T.tweet(file, {
            council: place.council
        }))
        .then(tweet => console.log(`https://twitter.com/postaisgalegas/status/${tweet}`))
        .catch(error => {
            console.log(error);
            return h.sleep(2).then(() => build());
        });
};

setInterval(() => build(), 5 * 60 * 1000);
build();

process.on('SIGINT', function() {
    console.log('Exiting');
    client.end();
    process.exit();
});
