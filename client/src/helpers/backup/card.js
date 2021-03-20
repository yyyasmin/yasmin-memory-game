
export default class Card {
    constructor(scene) {

        this.width=60, this.height=80 

        this.xPosition=0, this.yPosition=0
        this.sprite
        this.colIdx=0, this.rowIdx=0, this.idx=0
        this.faceUp = false
        this.isBackCard = false
        this.imageName = ''
        this.tweens
        const BOARD_COLS=4, BOARD_ROWS=2


        // FROM https://www.emanueleferonato.com/2017/08/18/how-to-create-a-html5-3d-flipping-card-animation-in-2d-using-phaser/

        // flipping speed in milliseconds
        this.flipSpeed = 200
 
        // flipping zoom ratio. Simulates the card to be raised when flipping
        this.flipZoom = 1.2

        this.getFlipZoom = () =>  {
            return this.flipZoom
        }

        this.getFlipSpeed = () =>  {
            return this.flipZoom
        }
         
        this.setIdx = (col, row) => {
            this.colIdx = col
            this.rowIdx = row
            this.idx = BOARD_COLS*row+col
            this.xPosition =  150 + ( this.colIdx * (this.width+150) )
            this.yPosition =  150 + ( this.rowIdx * (this.height+200) )
        }

        this.getIdx = () => {
            return this.idx
        }

        this.getHeight = () =>  {
            return this.height
        }

        this.getWidth = () =>  {
            return this.width
        }

        this.getFaceUp = () =>  {
            return (this.faceUp == true)
        }


        this.getX = () =>  {
            return this.xPosition
        }

        this.getY = () =>  {
            return this.yPosition
        }

        this.getColIdx = () =>  {
            return this.colIdx
        }

        this.getRowIdx = () =>  {
            return this.rowIdx
        }


        this.setImageName = (imageName) => {
            this.imageName = imageName
        }

        this.getImageName = () => {
            return this.imageName
        }


        this.setSprite = (sprite) =>  {
            this.sprite = sprite
        }
 
        this.getSprite = () =>  {
            return this.sprite
        }


        this.setTweens = (tweens) =>  {
            this.tweens = tweens
        }
 
        this.getTween = () =>  {
            return this.tweens
        }

            
  

  
        this.render = () => {
            let cardSprite
            let sprite = this.getSprite()

            if ( this.faceUp ) {
                sprite.setVisible(true)
            }

            else  {
                sprite.setVisible(false)
            }

            return sprite            
        }

    }

}