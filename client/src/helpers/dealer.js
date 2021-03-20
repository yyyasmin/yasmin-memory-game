import Card from './card'

export default class Dealer {
    constructor(scene) {


        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            };
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }

                
        this.setCardss = () => {
            let imagNameIdx = 0
            for (let col=0; col<scene.colss; col++)  {
                for (let row=0; row<scene.rowss; row++)  {

                    let card = new Card()
                    card.setIdx(col, row)
                    card.setFaceImage(scene.imageNames[imagNameIdx++])
                    card.setBackImage('y_rainbow')
                    scene.addCardToArray(card)
                }
            }

            let tmp = new Shufle(scene)
            this.cardsArray = tmp.shufleCards()
        }

    }
}