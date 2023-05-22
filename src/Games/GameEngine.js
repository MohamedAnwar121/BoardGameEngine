import {Component} from 'react';

// input cases handle.

    // xo >> 3 c
    // connect-4 >> 6 f
    // 8-queens >> 8 h
    // sudoku >> 9 k 9
    // chess >> 8 h 8 h
    // checkers >> 8 h 8 h

// starter color handle.
    // any another non valid input make:
        // xo: o
        // chess: b
        // connect - 4 : yellow
        // chess: b

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
        numbersScalar: 0.7,
        cellHeight: 0,
        cellWidth: 0,
        cellMargin: 5,
        borderRightWidth : 1,
        borderBottomWidth : 1,
        setColIndexesForWidth: [],
        setRowIndexesForWidth: [],
        showBoardNumbers: true,
        showBoardLetters: true,
        distributePieces: ""
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
        return Array.from(Array(rows), () => new Array(cols).fill(null));
    }

    initializeGamePieces() {}

    initializeComponentState() {}
    startState(chosenPieces){}

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

    drawer(state) {

        const rows = [];

        for (let j = 0; j <= this.board.cols; j++) {

            if (!this.board.showBoardNumbers && j === this.board.cols) break;

            const cells = [];

            for (let i = 0; i <= this.board.rows; i++) {

                if (!this.board.showBoardLetters && i === this.board.rows) break;


                cells.push(
                    <div className="col" key={i * (this.board.cols) + j}>
                        <button
                            key={i * (this.board.cols) + j}
                            style={this.getCellStyle(i,j)}
                            id={(i * (this.board.cols) + j).toString()}
                            disabled={(i === this.board.rows || j === this.board.cols)}
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
            borderWidth: '1px',
            borderRightWidth : this.setColBorderWidth(i,j),
            borderBottomWidth : this.setRowBorderWidth(i,j),
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
                borderRadius: '100px',
                opacity: '1',
                fontSize : this.board.numbersScalar * this.board.cellWidth,
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

    setColBorderWidth(i, j) {
        for (let a of this.board.setColIndexesForWidth) {
            if (a === j) {
                return this.board.borderRightWidth;
            }
        }
        return '1px';
    }

    setRowBorderWidth(i, j) {
        for (let a of this.board.setRowIndexesForWidth) {
            if (a === i) {
                return this.board.borderRightWidth;
            }
        }
        return '1px';
    }

    render() {
        return this.drawer();
    }

    async gameDirector() {

        // user choose his pieces.
        if( !this.singlePlayer ){
            let chosenShape = await this.waitForEvent(this.board.distributePieces);
            let temp = this.startState(chosenShape);
            console.log(temp);
            this.setState(temp);
        }

        // game start.
        let state = this.state;
        while (true) {

            let input = await this.waitForEvent("                                        << Enter input >>");
            if (input === null) break;

            state = this.controller(input, state);
            this.drawer(state);
        }
    }

    async waitForEvent(criteria) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let input = prompt(criteria);
                resolve(input);
            }, 1000);
        });
    }

    componentDidMount() {
        this.gameDirector().then();
    }

    getInput() {}
}

export default GameEngine;