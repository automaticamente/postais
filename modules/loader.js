'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const uuid = require('node-uuid');

class Loader {
    constructor(downloadFolder) {
        this.downloadFolder = downloadFolder;
    }

    load(url) {
        return new Promise((resolve, reject) => {
            let file = path.join(this.downloadFolder, `${uuid.v1()}.jpg`);
            let fileStream = fs.createWriteStream(file);

            fileStream.on('close', () => resolve(file));
            fileStream.on('error', (error) => reject(error));

            request.get(url)
                .on('error', error => reject(error))
                .on('response', (response) => {
                    if(response.headers['content-length'] < 10000) {
                        fs.unlinkSync(file);
                        reject('Could not find image.');
                    }
                })
                .pipe(fileStream);
        });
    }
}

module.exports = Loader;
