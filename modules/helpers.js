'use strict';

const helpers = {
    /**
     * Returns a random array element
     * @param {Array} array - An array
     */
    choice: (array) => {

        if (!Array.isArray(array)) {
            throw new Error('Argument must be array');
        }

        return array[Math.floor(array.length * Math.random())];

    },
    /**
     * Returns a random element and removes it from the array
     * @param {Array} array - An array
     */
    choiceRemove: (array) => {

        if (!Array.isArray(array)) {
            throw new Error('Argument must be array');
        }

        var index = Math.floor(array.length * Math.random());

        return array.splice(index, 1)[0];

    },
    /**
     * Returns a random number between two numbers
     * @param {Number} a - The min number, if b is not defined the min number will be 0 and this will be the max number
     * @param {Number} [b] - The max number
     */
    randint: (a, b) => {
        if (!b) {
            b = a;
            a = 0;
        }

        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Arguments must be numbers');
        }

        return Math.floor(Math.random() * (b - a + 1) + a);
    },
    sleep: (time) => {
        time = time ||  0;
        return new Promise((r) => {
            setTimeout(r, time * 1000);
        });
    },
    prefixer: (string) => {

        if (typeof string !== 'string') {
            throw new Error('Argument must be a string');
        }

        var prefixes = [{
            pre: 'A ',
            rep: 'na '
        }, {
            pre: 'O ',
            rep: 'no '
        }, {
            pre: 'As ',
            rep: 'nas '
        }, {
            pre: 'Os ',
            rep: 'nos '
        }];

        for (var i = 0; i < prefixes.length; i++) {
            var pref = prefixes[i];

            if (pref.pre === string.slice(0, pref.pre.length)) {
                return pref.rep + string.slice(pref.pre.length, string.length);
            }
        }

        return 'en ' + string;
    }

};

module.exports = helpers;
