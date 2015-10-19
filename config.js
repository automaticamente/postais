module.exports = {
    twitterAPI: {
        consumer_key: '',
        consumer_secret: '',
        access_token: '',
        access_token_secret: '',
    },
    mapsAPI: '',
    download: __dirname + '/download',
    output: __dirname + '/output',
    font: {
        postcard: __dirname + '/fonts/Forum-Regular.ttf',
        stamp: __dirname + '/fonts/Viga-Regular.ttf',
    },
    stamps: [{
        image: __dirname + '/images/selo-lu.png',
        color: '#f20823',
        offset: {
            x: 0,
            y: 0
        }
    }, {
        image: __dirname + '/images/selo-co.png',
        color: '#004f7e',
        offset: {
            x: -5,
            y: 0
        }
    }, {
        image: __dirname + '/images/selo-ou.png',
        color: '#000000',
        offset: {
            x: 0,
            y: 0
        }
    }, {
        image: __dirname + '/images/selo-po.png',
        color: '#113f31',
        offset: {
            x: 0,
            y: 0
        }
    }]
};
