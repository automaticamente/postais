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

    let url = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURI(place.council)},Spain&fov=90&heading=${h.randint(0,360)}&pitch=10&key=AIzaSyAnR2CI3d6MUBrU6E9LU2FqbMVZ7XVAj-Y`;

    new Loader(url, config.download).load()
        .then(file => new Builder(file, config.output, {
            font: config.font,
            place: place.council
        }).build())
        .catch(error => console.log(error));
};

build();
