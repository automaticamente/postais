'use strict';

const expect    = require('chai').expect;
const Loader = require('../modules/loader');
const config = require('../config');
const image = 'https://www.google.es/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const noImage = 'https://www.google.es/nope.png';

const loader = new Loader(config.download);

describe('Image Loader', () => {

	describe('Download images', () => {
		it('Should download an image', () => {
			return loader.load(image).then((file) => {
				expect(file).to.be.a('string');
			});
		});

		it('Should throw an error trying to download a non existant image', () => {
			return loader.load(noImage).catch((error) => {
				expect(error).to.be.an.instanceof(Errord);
			});
		});
	});
});