import * as PIXI from "pixi.js";
import {App} from '../system/App';
import {Scene} from '../system/Scene';
import {Field} from './Field';
import {Board} from './Board';
import {CombinationManager} from './CombinationManager';
export class Game extends Scene{


    constructor() {
        super();
        this.cmp=0;
        this.str=0;
        this.selectedTile = null;
        this.disabled = false;

    }

    create() {
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
                // this.swap(this.selectedTile, tile);
                this.swap2(this.selectedTile, tile);
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
        //this.processMatchesStart();
        this.disabled = false;
    }

    async swap2(selectedTile, tile) {
        this.disabled = true;
        this.clearSelection();
        selectedTile.sprite.zIndex = 2;

        // const a = selectedTile.moveTo(tile.field.position,4);
        // const b = tile.moveTo(selectedTile.field.position,4);
        // await a;
        // await b;
        // this.board.swap(selectedTile, tile)
        // //this.processMatchesStart();
        // this.disabled = false;

        Promise.all([selectedTile.moveTo(tile.field.position,0.2),
                   tile.moveTo(selectedTile.field.position,0.2)],
        ).then(() => {
            this.board.swap(selectedTile, tile)
            this.processMatches2AW();
            this.disabled = false;
        });
    }

    // async processMatchesStart2() {
    //     let matches = this.combinationManager.getMatches();
    //     console.log(matches);
        // const result = await this.processMatches(matches);
        // console.log('RESULT');
        // console.log(result);
        // if(result.length) {
        //     this.processMatches(result);
        // }
   // }

    async processMatchesStart() {
        let matches = this.combinationManager.getMatches();
        console.log('1');
        const result = await this.processMatches(matches);
        console.log('RESULT');
        console.log(result);
        if(result.length) {
            this.processMatches(result);
        }
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }



    async processMatches() {
        let matches = this.combinationManager.getMatches();
        if(matches.length) {
            console.log('START');
            await this.removeMatches(matches);
            await this.processFallDown();
            await this.fillEmptyFields();
            console.log('END');
            return this.combinationManager.getMatches();
        }
    }

    removeMatches(matches) {
        matches.forEach(line => {
            line.forEach(tile => tile.remove());
        });
    }


    async processMatches2AW() {
        let matches = this.combinationManager.getMatches();
        if(matches.length) {
            this.removeMatches(matches);
            await this.processFallDown2AW();
            console.log('FINISH');
//            await this.processFallDown();
//            await this.fillEmptyFields();
//            console.log('END');
//            return this.combinationManager.getMatches();
        }
    }

    asyncExecutor(fn) {
        fn();
    }

    async processFallDown3AW() {
        //const asyncTasks = [];
        for (let row = this.board.rows - 1; row >=0 ; row--) {
            for (let col = this.board.cols - 1; col >= 0 ; col--) {
                const field = this.board.getField(row, col);
                if (field.isEmpty()){
                    this.asyncExecutor(async () => {
                       await this.fallDownTo2AW(field);
                    });
                    //asyncTasks.push(this.fallDownTo2AW(field));
                    // this.fallDownTo2(field).then((data)=>{
                    //     this.cmp++;
                    //     if(this.cmp >= this.str) {
                    //         resolve();
                    //     }
                    // });
                }
            }
        }
        //asyncTasks.forEach(async asyncTask => await asyncTask);
    }



   async processFallDown2AW() {
            const asyncTasks = [];
            for (let row = this.board.rows - 1; row >=0 ; row--) {
                for (let col = this.board.cols - 1; col >= 0 ; col--) {
                    const field = this.board.getField(row, col);
                    if (field.isEmpty()){
                        asyncTasks.push(this.fallDownTo2AW(field));
                        // this.fallDownTo2(field).then((data)=>{
                        //     this.cmp++;
                        //     if(this.cmp >= this.str) {
                        //         resolve();
                        //     }
                        // });
                    }
                }
            }
            asyncTasks.forEach(async asyncTask => await asyncTask);
    }

    async fallDownTo2AW(emptyField) {
        for (let row = emptyField.row - 1; row >= 0 ; row--) {
            const failingField = this.board.getField(row, emptyField.col);
            if (!failingField.isEmpty()){
                emptyField.tile = failingField.tile;
                emptyField.tile.field = emptyField;
                failingField.tile = null;
                return emptyField.tile.fallDownTo(emptyField.position, 0.2);
            }
        }
        return;
    }


    async processMatches2() {
        let matches = this.combinationManager.getMatches();
        if(matches.length) {
            this.removeMatches(matches);
            this.processFallDown2AW()
                .then(() => {
                    console.log('FINISH THEN');
                })
                .catch(()=>{
                    console.log('FINISH CATCH');
                })
                .finally(()=>{
                    console.log('FINISH FINALLY');
                })


//            await this.processFallDown();
//            await this.fillEmptyFields();
//            console.log('END');
//            return this.combinationManager.getMatches();
        }
    }


   processFallDown2() {
        return new Promise((resolve) => {
            for (let row = this.board.rows - 1; row >=0 ; row--) {
                for (let col = this.board.cols - 1; col >= 0 ; col--) {
                    const field = this.board.getField(row, col);
                     if (field.isEmpty()){
                        // console.log('Вызываем '+(++this.counter));
                        this.str++;
                         console.log(`Отправляем str:${this.str} cmp${this.cmp}`);
                        this.fallDownTo2(field).then((data)=>{
                            this.cmp++;
                            console.log(`Зенкаем str:${this.str} cmp${this.cmp}`);
                            console.log(data)
                            if(this.cmp >= this.str) {
                                resolve();
                            }
                        });
                     }
                }
            }
        });
    }

    async fallDownTo2(emptyField) {
        for (let row = emptyField.row - 1; row >= 0 ; row--) {
            const failingField = this.board.getField(row, emptyField.col);
            if (!failingField.isEmpty()){
                emptyField.tile = failingField.tile;
                emptyField.tile.field = emptyField;
                failingField.tile = null;
                //console.log('to local');
                return emptyField.tile.fallDownTo(emptyField.position, 0.2);
            }
        }
        //console.log('закрываем '+(++this.counter));
        return Promise.resolve();
    }

    async processFallDown() {
        for (let row = this.board.rows - 1; row >= 0 ; row--) {
            for (let col = this.board.cols - 1; col >= 0 ; col--) {
                const field = this.board.getField(row, col);
                if (field.isEmpty()) {
                    await this.fallDownTo(field);
                }
            }
        }
    }
    async fallDownTo(emptyField) {
        for (let row = emptyField.row - 1; row >= 0 ; row--) {
            const fieldForMoving = this.board.getField(row, emptyField.col);
            if (!fieldForMoving.isEmpty()) {
                fieldForMoving.tile.moveTo(emptyField.position, 0.5);
                emptyField.tile = fieldForMoving.tile;
                emptyField.tile.field = emptyField;
                fieldForMoving.tile = null;
                await this.fallDownTo(fieldForMoving);
                return;
            }
        }
        // for (let row = emptyField.row - 1; row >= 0; row--){
        //     const fillForMoving = this.board.getField(row, emptyField.col);
        //     /*if (fillForMoving.isEmpty()){
        //         this.fallDownTo(fillForMoving);
        //     }*/
        //     if (!fillForMoving.isEmpty()) {
        //         fillForMoving?.tile?.fallDownTo(emptyField.position);
        //         return;
        //     }
        // }
    }

    async fillEmptyFields() {
        const emptyFields = this.board.fields.filter(field => field.isEmpty());
        emptyFields.forEach(field => {
            const tile = this.board.createTile(field);
            tile.sprite.y = -500;
            const delay = Math.random() * 2 / 10 + 1.3/(field.row + 1) ;
            tile.moveTo(field.position, delay);
        })
    }
}
