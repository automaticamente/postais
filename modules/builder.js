'use strict';

const fs = require('fs');
const path = require('path');

const uuid = require('node-uuid');

let client;

const randint = require('./helpers').randint;


const gm = require('gm').subClass({
    imageMagick: true
});

class Builder {
    constructor(outputFolder) {
        this.outputFolder = outputFolder;
    }

    build(file, options) {
        return new Promise((resolve, reject) => {
            let output = path.join(this.outputFolder, `${uuid.v1()}.jpg`);
            let outputStream = fs.createWriteStream(output);

            outputStream.on('close', () => {
                fs.unlinkSync(file);
                resolve(output);
            });

            outputStream.on('error', (error) => {
                reject(error);
            });

            client.get('postalnumber', (err, reply) => {
                if(err) {
                    reject(err);
                }

                gm(file)
                    .enhance()
                    .contrast(-2)
                    // .blur(0.1)
                    // .type('grayscale')
                    .crop(640, 400)
                    .borderColor('#fff')
                    .border(14, 14)
                    .extent(668, 460)
                    .font(options.font)
                    .fontSize(13)
                    .fill('#000')
                    .drawText(24, 432, `${reply}. ${options.place} - ${options.council.toUpperCase()} - Vista parcial`)
                    .fontSize(10)
                    .fill('#333')
                    .drawText(593, 430, `(c) ${new Date().getFullYear()} Google`)
                    .stream('jpg', (err, out) => {
                        if (err) {
                            reject(err);
                        }

                        gm(out)
                            .composite(options.stamp)
                            .gravity('NorthEast')
                            .geometry(`+${randint(20,60)}+${randint(20,60)}`)
                            .stream('jpg')
                            .pipe(outputStream);
                });
            });

        });

    }
}

module.exports = {
    setClient: (sharedClient) => client = sharedClient,
    Builder: Builder
};