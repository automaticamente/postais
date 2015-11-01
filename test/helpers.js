'use strict';

const expect = require('chai').expect;
const helpers = require('../modules/helpers');
let initialArray = [1, 2, 3];
let array = [1, 2, 3];

describe('Helpers', () => {
    describe('choice', () => {
        it('should return a random choice of array', () => {
            let choice = helpers.choice(array);

            expect(choice).to.be.a('number');
            expect(array).to.include(choice);
        });

        it('should throw an error if the argument is not an array', () => {
            expect(() => helpers.choice('string')).to.throw(Error);
        });
    });

    describe('choiceRemove', () => {
        it('should return a random choice and remove from the array', () => {
            let choice = helpers.choiceRemove(array);

            expect(choice).to.be.a('number');
            expect(initialArray).to.include(choice);
            expect(array).not.to.include(choice);
            expect(array.length).to.equal(initialArray.length - 1);
        });

        it('should throw an error if the argument is not an array', () => {
            expect(() => helpers.choice('string')).to.throw(Error);
        });
    });

    describe('randint', () => {
        it('should return a random integer', () => {
            let rand = helpers.randint(1, 10);

            expect(rand).to.be.a('number');
            expect(rand).to.be.within(1, 10);
        });

        it('should return a number between 0 and first argument if second argument is not present', () => {
            let rand = helpers.randint(10);

            expect(rand).to.be.a('number');
            expect(rand).to.be.within(0, 10);

        });

        it('should return an error if the arguments are not numbers', () => {
            expect(() => helpers.randint('string')).to.throw(Error);
        });
    });

    describe('sleep', () => {
        let foo = false;

        before((done) => {
            helpers.sleep().then(() => {
                foo = true;
                done();
            });
        });

        it('should execute the function after the delay', function() {
            expect(foo).to.be.true;
        });
    });

    describe('prefixer', () => {
        it('should add article', () => {
            expect(helpers.prefixer('A Lorem')).to.equal('na Lorem');
        });

        it('should not add article', () => {
            expect(helpers.prefixer('Lorem')).to.equal('en Lorem');
        });

        it('should throw an error if the argument is not a string', () => {
            expect(() => helpers.prefixer()).to.throw(Error);
        });
    });
});
