'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
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
                resolve(output);
            });

            outputStream.on('error', (error) => reject(error));

            gm(this.file)
                .sepia()
                .crop(600, 360)
                .border(16, 16)
                .font(this.options.font)
                .fontSize(13)
                .fill('#000')
                .drawText(24, 388, `3. ${this.options.place} - Vista parcial`)
                .stream()
                .pipe(outputStream);

        });

    }
}

module.exports = Builder;
