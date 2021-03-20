// FROM https://vuejsexamples.com/memory-card-game-with-vuejs/

import Card from './card'

var _ = require('lodash');
var cloneDeep = require('lodash.clonedeep');

export default class Shufle {
    constructor(scene) {
        this.shufleCards = () => {

            //console.log("IN shufleCards FUNCTION-- scene.cardsArray --: ", scene.cardsArray)
            let cards = _.cloneDeep(scene.cardsArray)
            let shufledCards = _.shuffle(cards);
            //console.log("IN Shufle shufledCards:", shufledCards)
            return shufledCards
        }
    }
}