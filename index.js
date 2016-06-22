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

const config = fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');

const B = new builder.Builder(config.output);
const L = new Loader(config.download);
const T = new tweeter.Tweeter(config.twitterAPI);

const nomenclator = require('./nomenclator.json');

const build = function() {
    let place = h.choice(nomenclator);

    let url = `https://maps.googleapis.com/maps/api/streetview?size=640x440&location=${encodeURI(place.place)},${encodeURI(place.parish)},${encodeURI(place.council)},${encodeURI(place.province)},Spain&fov=${h.randint(90,120)}&heading=${h.randint(0,360)}&pitch=0&key=${config.mapsAPI}`;

    L.load(url)
        .then(file => B.build(file, {
            font: config.font,
            stamp: config.stamps[place.province],
            council: place.council,
            place: place.place
        }))
        .then(file => T.tweet(file, {
            council: place.council
        }))
        .then(id => {
		console.log(`Link to tweet: https://twitter.com/postaisgalegas/status/${id}`);
		client.end();
		process.exit(0);
	})
        .catch(error => {
            console.log(error);
            return h.sleep(2).then(() => build());
        });
};

//setInterval(() => build(), 60 * 60 * 1000);
build();

process.on('SIGINT', function() {
    console.log('Exiting');
    client.end();
    process.exit();
});
