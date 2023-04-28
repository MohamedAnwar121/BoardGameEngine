import {Component} from 'react';
import {Col, Row} from "react-bootstrap";
import {keyboard} from "@testing-library/user-event/dist/keyboard";


class GameEngine extends Component {

    singlePlayer = false;
    playerState = {
        playerTurn: null,
        playerPieces: {},
        currentPiece: null
    };

    gamePieces = {};

    turn = {
        player1: 'player1',
        player2: 'player2'
    };

    board = {
        rows: 0,
        cols: 0,
    }

    cell = {
        height: 0,
        width: 0,
        default_color: null,
        alternating_color: null,
        shape: null,
        piece: null
    }

    pieces = null;



    // controller(event) {
    //     console.log('in parent');
    //     // event.preventDefault();
    //     console.log(event);
    //     // console.log(event.target);
    // }
    cellStyle = null;

    instantiateBoard(rows, cols) {
        this.board.rows = rows;
        this.board.cols = cols;
        return Array.from(Array(rows), () => new Array(cols).fill(null));
    }

    itemRender(rowIndex, colIndex) {
        const pieceEnum = this.state.grid[rowIndex][colIndex]; // enum
        const piece = this.pieces[pieceEnum];

        return piece;
    }

    drawer() {

        let data = this.state.grid;

        const rows = [];

        for (let j = 0; j < this.board.cols; j++) {
            const cells = [];


            for (let i = 0; i < this.board.rows; i++) {
                cells.push(
                    <div className="col" key={ i * (this.board.cols ) + j } >
                        <button
                            key={ i * (this.board.cols ) + j }
                            style={ this.cellStyle }
                            onClick={ this.controller }
                            id={ (i * (this.board.cols ) + j).toString() }>

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

    render() {
        return this.drawer();
    }

    initializeCellStyle(){
        this.cellStyle = {
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '30px',
            width: 600 / this.board.cols,
            height: 600 / this.board.cols,
        }
    }

}

export default GameEngine;
