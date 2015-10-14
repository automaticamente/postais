'use strict';

const fs = require('fs');

const Loader = require('./modules/loader');
const Builder = require('./modules/builder');
const Tweeter = require('./modules/tweeter');

const h = require('./modules/helpers');

const config =
    fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');


const nomenclator = require('./nomenclator.json');

const build = function() {
    let place = h.choice(nomenclator);

    let url = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURI(place.place)}, ${encodeURI(place.council)},Spain&fov=${h.randint(80,110)}&heading=${h.randint(0,360)}&pitch=0&key=AIzaSyAnR2CI3d6MUBrU6E9LU2FqbMVZ7XVAj-Y`;

    new Loader(url, config.download).load()
        .then(file => new Builder(file, config.output, {
            font: config.font,
            stamp: h.choice(config.stamps),
            council: place.council,
            place: place.place
        }).build())
        .then(file => new Tweeter(file, config.twitterAPI, {
            council: place.council
        }).tweet())
        .then(tweet => console.log(`https://twitter.com/postaisgalegas/status/${tweet}`))
        .catch(error => {
            console.log(error);
            return h.sleep(2).then(() => build());
        });
};

// setInterval(() => build(), 60 * 60 * 1000);
build();
