import Phaser from "phaser";
import Game from "./scenes/game"


const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,

    physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
		
	// FROM https://www.html5gamedevs.com/topic/38135-is-there-a-way-to-load-images-into-a-loading-scene-in-phaser-3-my-images-keep-failing-to-load/
	loader: {
			baseURL: 'assets/'
		},
	scene: [Game]
};

const game = new Phaser.Game(config);
