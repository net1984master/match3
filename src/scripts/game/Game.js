import * as PIXI from "pixi.js";
import {App} from '../system/App';
import {Scene} from '../system/Scene';
import {Field} from './Field';
import {Board} from './Board';
export class Game extends Scene{
    create() {
        this.createBackground();
        const board = new Board();
        this.container.addChild(board.container);
    }

    createBackground() {
        this.bg = App.sprite('bg');
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }
}
