import {App} from '../system/App';

export class CombinationManager {
    constructor(board) {
        this.board = board;
    }

    getMatches() {
        let result = [];
        this.board.fields.forEach(field => {
            App.config.combinationRules.forEach(rule => {
                // TODO: UM
                let matches = [field.tile];

                rule.forEach(position => {
                    const row = field.row + position.row;
                    const col = field.col + position.col;
                    const comparingField = this.board.getField(row, col);
                    if (comparingField && comparingField?.tile && comparingField.tile.color === field.tile.color) {
                        matches.push(comparingField.tile);
                    }
                });

                if (matches.length === rule.length + 1) {
                    result.push(matches);
                }
            });
        });
        // result.forEach(line => {
        //    line.forEach(tile => {
        //        const redSprite = App.sprite('dot');
        //        redSprite.anchor.set(0.5);
        //        tile.sprite.addChild(redSprite);
        //    })
        // });
        return result;
    }
}
