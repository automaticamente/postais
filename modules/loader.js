'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const uuid = require('node-uuid');

class Loader {
    constructor(url, downloadFolder) {
        this.url = url;
        this.downloadFolder = downloadFolder;
    }

    load() {
        return new Promise((resolve, reject) => {
            let file = path.join(this.downloadFolder, `${uuid.v1()}.jpg`);
            let fileStream = fs.createWriteStream(file);

            fileStream.on('close', () => resolve(file));
            fileStream.on('error', (error) => reject(error));

            request.get(this.url)
                .on('error', error => reject(error))
                .pipe(fileStream);
        });
    }
}

module.exports = Loader;
