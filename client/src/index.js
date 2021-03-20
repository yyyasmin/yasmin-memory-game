import Phaser from "phaser";
import Game from "./scenes/game"


const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,

    /******************************* 
    scale: {  // FROM https://codepen.io/rexrainbow/pen/pobEQLN?editors=1010
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    ******************************************************************************/
    physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
    
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);