import { gsap } from "gsap";
import {App} from '../system/App';
export class Tile {
    constructor(color) {
        this.color = color;
        this.sprite = App.sprite(this.color);
        this.sprite.anchor.set(0.5)
    }

    setPosition(position) {
        this.sprite.position = {...position};
    }

    async moveTo(position, duration) {
        await gsap.to(this.sprite, {
           duration,
           pixi: {
               x: position.x,
               y: position.y,
           }
        });
    }

    isNeighbour(tile) {
        return Math.abs(this.field.row - tile.field.row) + Math.abs(this.field.col - tile.field.col) === 1
    }

    remove() {
       const redSprite = App.sprite('dot');
       redSprite.anchor.set(0.5);
       this.sprite.addChild(redSprite);
    }
}
