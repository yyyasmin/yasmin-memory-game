
export default class Card {
    constructor(scene) {

        this.width=60, this.height=80 

        this.xPosition=0, this.yPosition=0
        this.sprite
        this.backSprite 
        this.colIdx=0, this.rowIdx=0, this.idx=0
        this.faceUp = false
        this.imageName = ''
        const BOARD_COLS=2, BOARD_ROWS=2
        this.myCard

        // FROM https://www.emanueleferonato.com/2017/08/18/how-to-create-a-html5-3d-flipping-card-animation-in-2d-using-phaser/
        // FOR ANIMATION
        this.isFlipping = false
        // flipping speed in milliseconds
        this.flipSpeed = 200 
        // flipping zoom ratio. Simulates the card to be raised when flipping
        this.flipZoom = 1.2

        this.set = (col, row, image) =>  {
            this.setImageName(image)
            this.setIdx(col, row)
        }

        this.getIsFlipping = () =>  {
            return this.isFlipping
        }

        this.setIsFlipping = (isFlipping) =>  {
            this.isFlipping = isFlipping
        }

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

        this.flipFaceUp = () =>  {
            this.faceUp = !this.faceUp
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

        this.setBackSprite = (backSprite) =>  {
            this.sprite = backSprite
        }
 
        this.getBackSprite = () =>  {
            return this.backSprite
        }

        this.setMyCard = (myCard) =>  {   // FROM https://codepen.io/rexrainbow/pen/pobEQLN
            this.myCard = myCard
        }
 
        this.getMyCard = () =>  {
            return this.myCard
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