'use strict';

const fs = require('fs');
const path = require('path');

const uuid = require('node-uuid');
const redis = require('redis');
const client = redis.createClient();


const gm = require('gm').subClass({
    imageMagick: true
});

class Builder {
    constructor(file, outputFolder, options) {
        this.file = file;
        this.outputFolder = outputFolder;
        this.options = options;
    }

    build() {
        return new Promise((resolve, reject) => {
            let output = path.join(this.outputFolder, `${uuid.v1()}.jpg`);
            let outputStream = fs.createWriteStream(output);

            outputStream.on('close', () => {
                fs.unlinkSync(this.file);
                client.end();
                resolve(output);
            });

            outputStream.on('error', (error) => {
                client.end();
                reject(error);
            });

            client.get('postalnumber', (err, reply) => {
                if(err) {
                    client.end();
                    reject(err);
                }

                gm(this.file)
                    .enhance()
                    .contrast(-2)
                    .sepia()
                    .crop(600, 360)
                    .borderColor('#fff')
                    .border(18, 18)
                    .font(this.options.font)
                    .fontSize(13)
                    .fill('#000')
                    .drawText(24, 392, `${reply}. ${this.options.place} - ${this.options.council.toUpperCase()} - Vista parcial`)
                    .fontSize(10)
                    .fill('#333')
                    .drawText(555, 390, `(c) ${new Date().getFullYear()} Google`)
                    .stream('jpg', (err, out) => {
                        if (err) {
                            client.end();
                            reject(err);
                        }

                        gm(out)
                            .composite(this.options.stamp)
                            .gravity('SouthEast')
                            .geometry('+50+50')
                            .stream('jpg')
                            .pipe(outputStream);
                    });
            });



        });

    }
}

module.exports = Builder;
