import io from 'socket.io-client';
import Card from '../helpers/card';
import Easing from 'easing-functions'
//import Quad from "phaser";

import axios from "axios"   // FROM https://github.com/sominator/mevn-character-generator/blob/master/client/src/App.vue

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {

        this.rowss = 2
        this.colss = 2
        this.imagePath = 'src/assets/myFlip/'
				
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
		
        this.cloudinaryImageUrls = []
        
        // FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/perspective-card/
        this.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
        
        
        //  FROM https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gridalign/
        this.load.plugin('rexgridalignplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridalignplugin.min.js', true);

       
       
        // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
		
		this.load.setCORS('anonymous')

    }



    create() {

		this.deploy = 0  // 1 ==> FOR PRODUCTION MODE
		
        this.isPlayerA = false;
        this.opponentCards = [];
 
        this.cardsArray = []

        let self = this;
				
				
		let port = (this.deploy == 1) ? 'https://yasmin-memory-game.herokuapp.com/' : 'http://localhost:3000'
		
		// FROM https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error
		//this.socket = io( port , { transport : ['websocket'] });
		this.socket = io( port , {transports: ['websocket', 'polling', 'flashsocket']});
		
				
		this.socket.on('connect', function () {
            //console.log('CLIENT HAS Connected to PORT: ' + port);
        });
			
	
        this.setCloudinaryUrl = (cloudinaryImageUrls) => {
			
			
			let frontName = ''
			let frontUrl = ''
				
			let backName = ''
			let backUrl = ''
			
			// FROM https://stackoverflow.com/questions/60317639/emitting-an-array-using-socket-io
									
			self.cloudinaryImageUrls = JSON.parse(cloudinaryImageUrls)
			//console.log("self.cloudinaryImageUrls", self.cloudinaryImageUrls)

			for (let i=0; i< self.cloudinaryImageUrls.length; i++)  {
				
				//frontName = self.cloudinaryImageUrls[i].frontImageName 
				frontName = 'aaa' 
				
				frontUrl =  self.cloudinaryImageUrls[i].frontUrl
				//frontUrl =   self.imagePath + 'aaa.PNG'
				//frontUrl =   'http://res.cloudinary.com/education-institute-in-israel/image/upload/v1618430218/rqmxbqlso0x55wkd0xad.png'
				
				// FROM https://youtu.be/gPzMRoPDrFk?t=221
				//frontUrl =  'https://cors-anywhere.herokuapp.com/src/assets/myFlip/aaa.PNG'
			//frontUrl =  'https://cors-anywhere.herokuapp.com/http://res.cloudinary.com/education-institute-in-israel/image/upload/v1618430218/rqmxbqlso0x55wkd0xad.png'
				
				backName = self.cloudinaryImageUrls[i].backImageName
				backUrl = self.cloudinaryImageUrls[i].backUrl
				
				
				//self.load.image(self.cloudinaryImageUrls[i].backImageName, self.cloudinaryImageUrls[i].backUrl)

				this.loadCloudinaryCrossOriginImage(frontName, frontUrl)
				
				//this.loadCloudinaryCrossOriginImage(backName, backUrl)
						
			}
		
		}

        this.loadCloudinaryCrossOriginImage = (imageName, imageUrl) =>  {
			
			
			//self.load.setCORS(true)  // FROM https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html	
			//self.load.image(imageName, imageUrl)
			//self.add.image(200, 200, imageName)


				
			self.textures.once('addtexture', function () {    // FROM https://phaser.io/examples/v3/view/textures/texture-from-base64
			
					console.log("NNNNNNNNNNNNNNNNfrontName UUUUUUUUUUUUUUUUUUUUUUfrontUrl", imageName, imageUrl)
					
					let ccc_img = self.add.image(400, 300, imageName);
					
					ccc_img.crossOrigin = 'anonymous'
					ccc_img.referrerPolicy="origin"

					console.log("ccc_img", ccc_img)

				}, self);
						

		
			let ccc = self.textures.addBase64(imageName, imageUrl);  // CROSS-ORIGIN PROBLM		
														             // FIX FROM https://stackoverflow.com/questions/63652140/axios-request-to-cloudinary-client-side-cors-policy-error
			ccc.crossOrigin = 'anonymous'
			ccc.referrerPolicy="origin"
			console.log("ccc", ccc)
		}	
       
	
	
						
        this.setCards = () =>  {

            let idx = 0

            for (let row=0; row<this.rowss; row++)  {   // FROM chrome-error://chromewebdata
                for(let col=0; col<this.colss; col++)  {

                    let card = new Card()
                    let imageName = this.imageNames[idx]
                    card.set(col, row, imageName)
										
                    let frontImageName = self.cloudinaryImageUrls[idx].frontImageName
					
                    let backImageName = self.cloudinaryImageUrls[idx].backImageName
					
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
               
            //console.log( myCard, myCard.flip )

            return myCard
        }
 
        
        // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
        this.flipMyCard = (cardIdx) =>  {


            let card = this.cardsArray[cardIdx].card
            let imageName = card.getImageName()
            let xPosition = card.getX(),  yPosition = card.getY()

            let cardSprite = card.getMyCard()

            if (cardSprite.localX <= (this.width / 2))  {
                ////console.log('FLIPPING  LEFT: back => front')
                self.socket.emit('flipLeftFromClient', card.getIdx());            

                //cardSprite.flip.flipLeft();
            } 
            else  {
                ////console.log('FLIPPING  RIGHT: front => back')
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

            ////console.log('IN flipMyCardF--- FROM SERVER   ', cardIdx )
            ////console.log('IN flipMyCardF--- FROM SERVER   TTHHIISS: BEFOR CALING FUNC   333', this)            

            self.flipMyCard( cardIdx ) 
        })

        this.socket.on('flipLeftFromServer', function( cardIdx ) {
            //this.cardsArray[cardIdx].card.setMyCard().flip.flipLeft();
            //console.log('CLIENT IS FLIPING flipLeftFromServer ')

            self.cardsArray[cardIdx].card.getMyCard().flip.flipLeft();

        })

        this.socket.on('flipRightFromServer', function( cardIdx ) {
            //console.log('CLIENT IS FLIPING flipRightFromServer ' )
            let card = self.cardsArray[cardIdx].card
            card.getMyCard().flip.flipRight();
            //card.getMyCard().face = card.getFaceUp() ? 'front' : 'back',
        })

        this.socket.on('setCardss', function (cloudinaryImageUrls) {
			////console.log("IN CLIENT ON setCardss URLS: ", cloudinaryImageUrls)
			self.setCloudinaryUrl(cloudinaryImageUrls)
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