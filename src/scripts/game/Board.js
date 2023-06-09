import * as PIXI from "pixi.js";
import {App} from '../system/App';
import {Field} from './Field';
import {Tile} from './Tile';
import {TileFactory} from './TileFactory';
export class Board {

    constructor() {
        this.container = new PIXI.Container();
        this.fields = [];
        this.rows = App.config.board.rows;
        this.cols = App.config.board.cols;
        this.create();
        this.ajustPosition();
    }

    create() {
        this.createFields();
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.fieldSize * this.cols;
        this.height = this.fieldSize * this.rows;

        this.createTiles();
    }
    createFields() {
        for(let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }

    createField(row, col) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    ajustPosition() {
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2;
    }

    createTiles() {
        this.fields.forEach(field => this.createTile(field));
        // for (let i = 0; i < this.fields.length; i++) {
        //     this.createTile(this.fields[i],App.config.testBoard[i]);
        // }
    }
    createTile(field, color) {
        const tile = color ? new Tile(color) : TileFactory.generate();
        this.container.addChild(tile.sprite);
        field.setTile(tile);

        tile.sprite.interactive = true;
        tile.sprite.on('pointerdown', () => {
            this.container.emit('tile-touch-start', tile);
        })
        return tile;
    }

    swap(tile1, tile2) {
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;

        tile2.field = tile1Field;
        tile1.field = tile2Field;

        tile1.field.tile = tile1;
        tile2.field.tile = tile2;

    }

    getField(row, col) {
        return this.fields.find(field => field.row === row && field.col === col);
    }

}
