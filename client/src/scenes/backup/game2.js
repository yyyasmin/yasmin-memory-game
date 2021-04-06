import io from 'socket.io-client';
import Card from '../helpers/card';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {

        this.backImageName = 'y_rainbow'

        this.imageNames = [
            'y_rainbow',
            'animal1',
            'animal2' ,
            'esher1',
            'esher2',
            'boringjoke1',
            'boringjoke2',
            'duck1a',
            'duck2a',
            'esher2',
            'esher2',
            'eyes1',
            'eyes2',
            'joke1',
            'joke2',
            'mimica1',
            'mimica2',
            'move1',
            'move2',
            'play1',
            'play2',
            'proff1',
            'proff1',
        ]

        let loadStrFace
        let loadStrBack = this.load.image(this.backImageName, 'src/assets/communication/'+ this.backImageName + '.PNG')
        for (let i=0; i<this.imageNames.length; i++) 
            loadStrFace = this.load.image(this.imageNames[i], 'src/assets/communication/'+ this.imageNames[i] + '.PNG')
   
	}


    create() {

        this.isPlayerA = false;
        this.opponentCards = [];
 
        this.rowss = 2
        this.colss = 4

        this.cardsArray = []

        let self = this;

        this.socket = io('http://localhost:3000');
 
        this.socket.on('connect', function () {
            console.log('Connected!');
        });


        this.setCards = () =>  {

            let idx=0
            for (let row=0; row<this.rowss; row++)  {
                for(let col=0; col<this.colss; col++)  {

                    let card = new Card()
                  
                    card.setImageName(this.imageNames[idx])
					card.setIdx(col, row)

                    card.setSprite(this.createNewSprite(card, this.imageNames[idx]))

                    if ( this.imageNames[idx] == this.backImageName)
                        card.isBackCard = true

                    this.cardsArray.push( {
                        card: card
                    } )

                    idx++
 
				}
            }

        }

        this.createNewSprite = (card, imageName) =>  {

            let cardSprite = this.physics.add.sprite(card.getX(), card.getY(), imageName).
            setSize(card.getWidth(), card.getHeight())
           .setInteractive().              
            setVisible(true)
            cardSprite.inputEnabled=true;
            cardSprite.enabled=true;
            // FROM https://stackoverflow.com/questions/48053064/phaser-sprite-animation-wont-play
            //this.cardFlipAnimation(card, cardSprite, imageName)

            cardSprite.on('pointerdown', function () {
                self.socket.emit('flipfromclient', card.getIdx(), cardSprite);            
            }, this);

            return cardSprite

        }


        // FROM https://stackoverflow.com/questions/55495662/how-to-make-card-flip-animation-in-phaser-3
        this.flipCard = (cardIdx, sprite) =>  {
            this.cardFlipAnimation(cardIdx, sprite)
            this.cardsArray[cardIdx].faceUp = !this.cardsArray[cardIdx].faceUp
        }


        this.cardFlipAnimation = (cardIdx, sprite) =>  {

            let card = this.cardsArray[cardIdx].card
            let imageName = card.getImageName()

            // FROM https://www.html5gamedevs.com/topic/36016-make-animation-from-separate-files-ie-not-spritesheet/
      
            let image_1 = card.faceUp ? imageName : this.backImageName
            let image_2 = card.faceUp ? this.backImageName :  imageName

            let cardAnimationKey =  'myFlipCard' + String(cardIdx)

            console.log(cardAnimationKey)

            this.anims.create({
                key: cardAnimationKey,
                frames: [
                    { key: image_1, frame: null },
                    { key: image_2, frame: null, duration: 20 }
                ],
                frameRate: 5,
                repeat: 0
            });


            this.cardsArray[cardIdx].card.getSprite().play(cardAnimationKey);


            // FROM https://stackoverflow.com/questions/55495662/how-to-make-card-flip-animation-in-phaser-3

                // scale horizontally to disappear
                var tween1 = this.scene.tweens.add({
                    targets: image_1,
                    scaleX: 0.01,
                    ease: 'Linear',
                    duration: 300,
                    repeat: 0,
                    yoyo: false
                });

                tween1.onComplete.add(function(){this.onTurnCard(cartaObj);}, this);

                onTurnCard: function(card) {
                    // set card face somehow
                    card.frameName = 'HeartQueen'; // ?

                    // scale horizontally to re-appear
                    var twn = this.scene.tweens.add({
                        targets: card,
                        scaleX: 1.0,
                        ease: 'Linear',
                        duration: 300,
                        repeat: 0,
                        yoyo: false
                    });
            
            // FROM https://stackoverflow.com/questions/55495662/how-to-make-card-flip-animation-in-phaser-3

        }


        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('flipfromserver', function (cardIdx, sprite) {
            self.flipCard(cardIdx, sprite)
        })


        this.socket.on('setCardss', function () {
            self.setCards()
        })



        this.newMemoryGamelText = this.add.text(75, 700  , ['NEW MEMORY GAME']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#ffff66').setInteractive();

        // MEMORY TEXT
        this.newMemoryGamelText.on('pointerdown', function () {
            self.socket.emit('setCardss');
        })

        this.newMemoryGamelText.on('pointerover', function () {
            self.newMemoryGamelText.setColor('#ff69b4');
        })

        this.newMemoryGamelText.on('pointerout', function () {
            self.newMemoryGamelText.setColor('#ffff66');
        })
       // MEMORY TEXT

    }


    update() {

    }


}