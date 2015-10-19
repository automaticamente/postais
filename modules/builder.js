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
            let stampTemp;

            outputStream.on('close', () => {
                fs.unlinkSync(file);
                fs.unlinkSync(stampTemp);
                resolve(output);
            });

            outputStream.on('error', (error) => {
                reject(error);
            });

            client.get('postalnumber', (err, reply) => {
                if (err) {
                    reject(err);
                }

                gm(file)
                    .enhance()
                    .contrast(-2)
                    .crop(640, 400)
                    .borderColor('#fff')
                    .border(14, 14)
                    .extent(668, 460)
                    .font(options.font.postcard)
                    .fontSize(14)
                    .fill('#000')
                    .drawText(24, 432, `${reply}. ${options.place} - ${options.council.toUpperCase()} - Vista parcial`)
                    .fontSize(11)
                    .fill('#333')
                    .drawText(580, 430, `(c) ${new Date().getFullYear()} Google`)
                    .quality(90)
                    .stream('jpg', (err, out) => {
                        if (err) {
                            reject(err);
                        }

                        stampTemp = path.join(this.outputFolder, `${uuid.v1()}.png`);
                        let date = new Date();

                        gm(options.stamp.image)
                            .resize(120, 120)
                            .fill(options.stamp.color)
                            .font(options.font.stamp)
                            .fontSize(18)
                            .drawText(27 + options.stamp.offset.x, 64 + options.stamp.offset.y, `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear().toString().slice(2)}`)
                            .rotate('transparent', randint(-20, 20))
                            .write(stampTemp, (err) => {
                                if (err) {
                                    reject(err);
                                }

                                gm(out)
                                    .composite(stampTemp)
                                    .gravity('NorthEast')
                                    .geometry(`+${randint(20,60)}+${randint(20,60)}`)
                                    .stream('jpg')
                                    .pipe(outputStream);

                            });

                    });
            });

        });

    }
}

module.exports = {
    setClient: (sharedClient) => client = sharedClient,
    Builder: Builder
};
