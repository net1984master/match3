import {Tools} from '../system/Tools';
import {Game} from './Game';

export const Config = {
    loader: Tools.massiveRequire(require['context']('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    startScene: Game,
    scenes: {
        'Game': Game,
    },
    board: {
        rows: 6,
        cols: 6,
    },
    testBoard:
        ['red','orange','orange','red',
        'red','red','red','green',
        'red','green','red','orange',
        'green','blue','blue','red'],
    tilesColors: ['blue', 'green', 'orange','red','orange', 'pink','yellow'],
    //tilesColors: ['blue', 'green', 'orange','red',],
    // tilesColors: ['blue', 'green', 'orange'],
    combinationRules: [
        [
            {col: 1, row: 0},
            {col: 2, row: 0},
        ],
        [
            {col: 0, row: 1},
            {col: 0, row: 2},
        ]
    ]
}
