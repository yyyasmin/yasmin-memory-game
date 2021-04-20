import io from 'socket.io-client';
import Card from '../helpers/card';
import Easing from 'easing-functions'

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {

        this.rowss = 2
        this.colss = 2
		this.numOfCards = 4
		
        //this.imagePath = 'src/assets/myFlip/'

        //this.backImageName = 'y_rainbow'

        this.cloudinaryImageUrls = []
		
        //let imageFullPath
		
        //let frontImageName
        //let backtImageName
        
        // FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/perspective-card/
        this.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
        
        
        //  FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gridalign/
        this.load.plugin('rexgridalignplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridalignplugin.min.js', true);
	       
    }



    create() {
		
		this.deploy = 0  // 1 ==> FOR PRODUCTION MODE
		
        this.isPlayerA = false;
        this.opponentCards = [];
 
        this.cardsArray = []

        let self = this;
		
		if ( this.deploy == 1 )
			this.socket = io('https://yasmin-memory-game.herokuapp.com/');
		else
			this.socket = io('http://localhost:3000');
 
        this.socket.on('connect', function () {
            console.log('Connected!');
        });
		
	
	
        this.socket.on('cardsUrlFromServer', function (cloudinaryImageUrls) {
									
			// FROM https://stackoverflow.com/questions/60317639/emitting-an-array-using-socket-io
			
			self.cloudinaryImageUrls = JSON.parse(cloudinaryImageUrls)
			
			for (let i=0; i< self.cloudinaryImageUrls.length; i++)  {
				
				console.log("IDX: ", i)
				
				console.log("FRONT NAME: ", self.cloudinaryImageUrls[i].frontImageName)
				console.log("FRONT URL: ", self.cloudinaryImageUrls[i].frontUrl)				
				self.load.image(self.cloudinaryImageUrls[i].frontImageName, self.cloudinaryImageUrls[i].frontUrl)
				
				console.log("BACK NAME: ",  self.cloudinaryImageUrls[i].backImageName)
				console.log("BACK URL: ",   self.cloudinaryImageUrls[i].backUrl)
				self.load.image(self.cloudinaryImageUrls[i].backImageName, self.cloudinaryImageUrls[i].backUrl)

			}
						
        });
		
				
        this.setCards = () =>  {

            let idx = 0
			
            for (let row=0; row<this.rowss; row++)  {   // FROM chrome-error://chromewebdata
                for(let col=0; col<this.colss; col++)  {

                    let card = new Card()
					
					
                    let imageName = self.cloudinaryImageUrls[idx].frontImageName					
					console.log("imageName", imageName)

                    let backImageName = self.cloudinaryImageUrls[idx].backImageName					
					console.log("backImageName", backImageName)
					
					//let imageUrl = self.cloudinaryImageUrls[idx].front
					
                    card.set(col, row, imageName)

                    let myCard = this.createMyCard (card, imageName, backImageName)  // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
                    
                    card.setMyCard(myCard)

                    this.cardsArray.push( {
                        card: card,
                    } )

                    idx++
 
				}
            }
        }

       
        // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
        this.createMyCard = (card, imageName, backImageName)  => {
            
			console.log("IN createMyCard")
			console.log("imageName", imageName)
			console.log("backImageName", backImageName)
			
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

		// DEBUG
		this.load.image('xxx', 'src/assets/myFlip/animal_a0.PNG')
		this.image = this.add.sprite(100, 500, 'xxx').setScale(5.0)
	

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