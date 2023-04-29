import {Component} from 'react';


class GameEngine extends Component {

    singlePlayer = false;

    turn = {
        player1: 'player1',
        player2: 'player2'
    };

    playerState = {
        playerTurn: null,
        playerPieces: {},
        currentPiece: null
    };

    gamePieces = {};

    board = {
        rows: 0,
        cols: 0,
        isAlternatingColor : false,
        baseColor: 'white',
        alternatingColor: '#1a1c21',
        isCircular: false
    }

    piecesSource = {};


    instantiateBoard(rows, cols) {
        this.board.rows = rows;
        this.board.cols = cols;
        return Array.from(Array(rows), () => new Array(cols).fill(null));
    }

    itemRender(rowIndex, colIndex) {
        const pieceEnum = this.state.grid[rowIndex][colIndex]; // enum
        return (pieceEnum === null) ?  '' : this.piecesSource[pieceEnum];
    }

    drawer() {
        const rows = [];

        for (let j = 0; j < this.board.cols; j++) {
            const cells = [];

            for (let i = 0; i < this.board.rows; i++) {
                cells.push(
                    <div className="col" key={ i * (this.board.cols ) + j } >
                        <button
                            key={ i * (this.board.cols ) + j }
                            style={ this.initializeCellStyle(i,j) }
                            onClick={ this.controller }
                            id={ (i * (this.board.cols ) + j).toString() }>
                            {this.itemRender(i,j)}
                        </button>
                    </div>
                );
            }
            rows.push(
                <div className="grid-row" key={this.board.rows * this.board.cols +j}>
                    <div className="row d-block" >
                        {cells}
                    </div>
                </div>
            );
        }

        return <div className="grid-container">{rows}</div>;

    }

    initializeCellStyle(i,j){
        return  {
            backgroundColor: (!this.board.isAlternatingColor) ?
                this.board.baseColor : this.getAlternatingColIfNeeded(i,j),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: (this.board.isCircular) ? 600 / this.board.cols : 0,
            border: 'solid',
            width: 600 / this.board.cols,
            height: 600 / this.board.cols,
        }
    }

    getAlternatingColIfNeeded(i,j){
        return ( (i + j) % 2 !== 0 ) ? this.board.alternatingColor : this.board.baseColor;
    }

    render() {return this.drawer();}
}

export default GameEngine;
