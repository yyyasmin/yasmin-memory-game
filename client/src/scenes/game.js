import io from 'socket.io-client';
import Card from '../helpers/card';
import Easing from 'easing-functions'
//import Quad from "phaser";


export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {

        this.rowss = 2
        this.colss = 2
        // this.imagePath = 'assets/'   MOVED TO INDEX As BaseUrl

        this.backImageName = 'y_rainbow'

        this.imageNames = [
            'animal_a',
            'animal_b' ,
            'boring_joke_a',
            'boring_joke_b',

            /***********************
             
            'duck_a',
            'duck_b',
            'esher_a',
            'esher_b',
            'eyes_a',
            'eyes_b',
            'joke_a',
            'joke_b',
            'mimica_a',
            'mimica_b',
            'move_a',
            'move_b',
            'play_a',
            'play_b',
            'proff_a',
            'proff_b'

            *****************************/
        ]

        let imageFullPath
        let frontImageName
        let backtImageName

        for (let i=0; i<this.imageNames.length; i++)   { // FROM chrome-error://chromewebdata
		
            this.load.image(this.imageNames[i]+'0', this.imageNames[i] + '0' + '.PNG')

            //this.load.image(this.imageNames[i]+'1', this.imageNames[i] + '1' + '.PNG')
            this.load.image(this.imageNames[i]+'1', this.imageNames[i] + '1' + '.png')
        }
		
        // FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/perspective-card/
        this.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
                
        //  FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gridalign/
        this.load.plugin('rexgridalignplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridalignplugin.min.js', true);

    }



    create() {

		this.deploy = 1  // 1 ==> FOR PRODUCTION MODE
		
        this.isPlayerA = false;
        this.opponentCards = [];
 
        this.cardsArray = []

        let self = this;
		
		console.log("DEPLOY=", this.deploy)

		let PORT = (this.deploy == 1) ? 'https://yasmin-memory-game-server.herokuapp.com/'  :  'http://localhost:3000'	
		
		console.log("CLIENT HAS CONNECTED IN ", PORT)
				
        this.socket = io(PORT)
			
			
        this.socket.on('connect', function () {
            //console.log('Connected!');
        });


        this.setCards = () =>  {

            let idx = 0

            for (let row=0; row<this.rowss; row++)  {   // FROM chrome-error://chromewebdata
                for(let col=0; col<this.colss; col++)  {

                    let card = new Card()
                    let imageName = this.imageNames[idx]
                    card.set(col, row, imageName)

                    let frontImageName = this.getFrontImageName(imageName)
                    let backImageName =  this.getBackImageName(imageName)
					
					console.log(frontImageName, backImageName)
					
                    let myCard = this.createMyCard (card, frontImageName, backImageName)  // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
                    
                    card.setMyCard(myCard)

                    this.cardsArray.push( {
                        card: card,
                    } )

                    idx++
 
				}
            }
        }


        this.getFrontImageName = (imageName) =>  {
            return imageName + '0'
        }

        this.getBackImageName = (imageName) =>  {
            return imageName + '1'
        }
        

        
        // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
        this.createMyCard = (card, imageName, backImageName)  => {
            
            let cardIdx  =  card.getIdx()
            
            let myCard =  this.add.rexPerspectiveCard(card.getX(), card.getY(), {
                front: { key: imageName },
                back:  { key: backImageName },
                face: card.getFaceUp() ? 'front' : 'back',

                flip: {            
                    frontToBack: 'right',
                    backToFront: 'left',
                    duration: 1000,
                    ease: 'Cubic'
                }
            })
            
            myCard.
            setSize(card.getWidth(), card.getHeight())
            .setInteractive().              
            setVisible(true)

            //myCard.inputEnabled=true;
            //myCard.enabled=true;

            myCard.on('pointerdown', function () {  
                self.socket.emit('flipMyCardFromClient', card.getIdx());            
            }, this);        
               
            console.log( myCard, myCard.flip )

            return myCard
        }
 
        
        // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
        this.flipMyCard = (cardIdx) =>  {


            let card = this.cardsArray[cardIdx].card
            let imageName = card.getImageName()
            let xPosition = card.getX(),  yPosition = card.getY()

            let cardSprite = card.getMyCard()

            if (cardSprite.localX <= (this.width / 2))  {
                //console.log('FLIPPING  LEFT: back => front')
                self.socket.emit('flipLeftFromClient', card.getIdx());            

                //cardSprite.flip.flipLeft();
            } 
            else  {
                //console.log('FLIPPING  RIGHT: front => back')
                self.socket.emit('flipRightFromClient', card.getIdx());            

                //cardSprite.flip.flipRight();
             }

            card.flipFaceUp()

            // this.flip.flip();
        }                      
                

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('flipMyCardFromServer', function( cardIdx ) {

            //console.log('IN flipMyCardF--- FROM SERVER   ', cardIdx )
            //console.log('IN flipMyCardF--- FROM SERVER   TTHHIISS: BEFOR CALING FUNC   333', this)            

            self.flipMyCard( cardIdx ) 
        })

        this.socket.on('flipLeftFromServer', function( cardIdx ) {
            //this.cardsArray[cardIdx].card.setMyCard().flip.flipLeft();
            console.log('CLIENT IS FLIPING flipLeftFromServer ')

            self.cardsArray[cardIdx].card.getMyCard().flip.flipLeft();

        })

        this.socket.on('flipRightFromServer', function( cardIdx ) {
            console.log('CLIENT IS FLIPING flipRightFromServer ' )
            let card = self.cardsArray[cardIdx].card
            card.getMyCard().flip.flipRight();
            //card.getMyCard().face = card.getFaceUp() ? 'front' : 'back',
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