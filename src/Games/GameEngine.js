import {Component, createRef} from 'react';


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
        isAlternatingColor: false,
        baseColor: 'white',
        alternatingColor: '#1a1c21',
        isCircular: false,
        cellScalar: 1,
        pieceScalar: 0.7,
        cellHeight: 0,
        cellWidth: 0,
        cellMargin: 5,
        buttonsReferenceGrid: []
    }

    piecesSource = {};

    setCellScalar(val) {
        this.board.cellScalar = Math.min(val, 1);
    }

    setPieceScalar(val) {
        this.board.pieceScalar = Math.min(val, 1);
    }

    setIsAlternating(val) {
        this.board.isAlternatingColor = val;
    }


    instantiateBoard(rows, cols) {
        this.board.rows = rows;
        this.board.cols = cols;
        this.board.cellWidth = (600 / this.board.cols) * this.board.cellScalar;
        this.board.cellHeight = (600 / this.board.cols) * this.board.cellScalar;

        for (let i = 0; i < this.board.rows; i++) {
            if (!this.board.buttonsReferenceGrid[i]) {
                this.board.buttonsReferenceGrid[i] = [];
            }

            for (let j = 0; j < this.board.cols; j++) {
                this.board.buttonsReferenceGrid[i][j] = createRef();
            }
        }

        return Array.from(Array(rows), () => new Array(cols).fill(null));
    }

    initializeGamePieces() {}

    initializeComponentState() {}

    initializePiecesSource() {}

    itemRender(rowIndex, colIndex) {
        const pieceEnum = this.state.grid[rowIndex][colIndex]; // enum
        return (pieceEnum === null) ? '' : this.piecesSource[pieceEnum];
    }

    getItem(rowIndex, colIndex){
        if ( rowIndex === this.board.rows && colIndex === this.board.cols ){
            return '';
        } else if ( rowIndex === this.board.rows ){
            return String.fromCharCode(colIndex + 65);
        } else if ( colIndex === this.board.cols ){
            return rowIndex + 1;
        } else {
            return this.itemRender(rowIndex,colIndex);
        }
    }

    drawer() {
        const rows = [];

        for (let j = 0; j <= this.board.cols; j++) {

            const cells = [];

            for (let i = 0; i <= this.board.rows; i++) {

                cells.push(
                    <div className="col" key={i * (this.board.cols) + j}>
                        <button
                            key={i * (this.board.cols) + j}
                            style={this.getCellStyle(i,j)}
                            id={(i * (this.board.cols) + j).toString()}
                            // ref={ (j ===  this.board.cols || i === this.board.rows) ? r => {
                            //     this.board.buttonsReferenceGrid[i][j] = r;
                            // } : null}
                            >
                            {this.getItem(i, j)}
                        </button>
                    </div>
                );
            }

            rows.push(
                <div className="grid-row" key={this.board.rows * this.board.cols + j}>
                    <div className="row d-block">
                        {cells}
                    </div>
                </div>
            );
        }

        return <div className="grid-container">
            {rows}
        </div>;

    }

    initializeCellStyle(i, j) {
        return {
            backgroundColor: (!this.board.isAlternatingColor) ?
                this.board.baseColor : this.getAlternatingColIfNeeded(i, j),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: (this.board.isCircular) ? this.board.cellWidth : 0,
            border: 'solid',
            borderWidth: '0',
            margin: `${this.board.cellMargin}px ${this.board.cellMargin / 2}px`,
            width: this.board.cellWidth,
            height: this.board.cellHeight
        }
    }

    getCellStyle(i,j){

        if (i < this.board.rows && j < this.board.cols) return this.initializeCellStyle(i,j);
        else {
            return {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'none',
                cursor: 'pointer',
                color: 'white',
                disabled: 'true',
                borderRadius: '100px',
                fontSize : this.board.pieceScalar * this.board.cellWidth,
                borderWidth: (i !== this.board.rows || j !== this.board.cols) ? '5px' : '0' ,
                margin: `${this.board.cellMargin}px ${this.board.cellMargin / 2 }px`,
                width: this.board.cellWidth,
                height: this.board.cellHeight
            }
        }
    }

    getAlternatingColIfNeeded(i, j) {
        return ((i + j) % 2 !== 0) ? this.board.alternatingColor : this.board.baseColor;
    }

    render() {
        return this.drawer();
    }

    async gameDirector() {
        while (true) {
            let input = await this.waitForEvent();
            if (input === null) break;

            // let words = input.split(/\s+/);
            this.controller(input);
            // this.drawer();
        }
    }

    async waitForEvent() {
        return new Promise((resolve) => {
            setTimeout(() => {
                let input = prompt("Enter input or click cancel to exit >>");
                resolve(input);
            }, 100);
        });
    }

    componentDidMount() {
        this.gameDirector().then();
    }
}

export default GameEngine;
