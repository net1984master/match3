import * as PIXI from "pixi.js";
import {App} from '../system/App';
import {Scene} from '../system/Scene';
import {Field} from './Field';
import {Board} from './Board';
import {CombinationManager} from './CombinationManager';
export class Game extends Scene{

    constructor() {
        super();
        this.selectedTile = null;
        this.disabled = false;

        this.createBackground();

        this.board = new Board();
        this.container.addChild(this.board.container);
        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        this.combinationManager = new CombinationManager(this.board);
    }

    onTileClick(tile) {
        if (this.disabled) return;

        if (this.selectedTile) {
            if (this.selectedTile.isNeighbour(tile)) {
                this.swap(this.selectedTile, tile);
            }
        } else {
            this.selectTile(tile);
        }
    }

    createBackground() {
        this.bg = App.sprite('bg');
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedTile.field.select();
    }

    async swap(selectedTile, tile) {
        this.disabled = true;
        this.clearSelection();
        selectedTile.sprite.zIndex = 2;

        selectedTile.moveTo(tile.field.position,0.2);
        await tile.moveTo(selectedTile.field.position,0.2);
        this.board.swap(selectedTile, tile)
        this.processMatches(this.combinationManager.getMatches());
        this.disabled = false;
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    processMatches(matches) {
        if(matches.length) {
            this.removeMatches(matches);
        }
    }

    removeMatches(matches) {
        matches.forEach(line => {
            line.forEach(tile => tile.remove());
        });
    }
}
