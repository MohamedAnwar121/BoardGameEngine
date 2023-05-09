import GameEngine from "./GameEngine";

class EightQueens extends GameEngine {
    initializeGamePieces() {
        this.gamePieces = {
            queen: 'queen'
        };
    }

    initializeComponentState() {
        this.setCellScalar(1.1);
        this.setPieceScalar(0.8);

        this.state = {
            grid: this.instantiateBoard(8, 8)
        };
    }

    initializePiecesSource() {
        this.piecesSource[this.gamePieces.queen] = <i className="fa fa-chess-king" style={
            {
                fontSize: this.board.pieceScalar * this.board.cellWidth,
            }}></i>;
    }

    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializePiecesSource();

        // data missing error correction
        this.controller = this.controller.bind(this);
    }

    controller(event) {
        let rowIndex = (event.currentTarget.id / this.board.cols) >> 0;
        let colIndex = (event.currentTarget.id % this.board.cols) >> 0;

        if (this.state.grid[rowIndex][colIndex] !== null) {
            this.state.grid[rowIndex][colIndex] = null;
            this.setState({grid: this.state.grid});
            return;
        }

        // invalid play.

        let isValid = true;
        // [1] row check.
        for (let i = 0; i < this.board.cols; i++) {
            isValid &&= (this.state.grid[rowIndex][i] === null);
        }
        // [2] col check.
        for (let i = 0; i < this.board.rows; i++) {
            isValid &&= (this.state.grid[i][colIndex] === null);
        }
        // [3.a] 135` diagonal
        for (let rowDir = rowIndex, colDir = colIndex; rowDir < this.board.rows && colDir < this.board.cols; rowDir++, colDir++) {
            isValid &&= (this.state.grid[rowDir][colDir] === null);
        }
        // [3.b] 135` diagonal
        for (let rowDir = rowIndex, colDir = colIndex; rowDir >= 0 && colDir >= 0; rowDir--, colDir--) {
            isValid &&= (this.state.grid[rowDir][colDir] === null);
        }

        // [4.a] 45` diagonal
        for (let rowDir = rowIndex, colDir = colIndex; rowDir >= 0 && colDir < this.board.cols; rowDir--, colDir++) {
            isValid &&= (this.state.grid[rowDir][colDir] === null);
        }
        // [4.b] 45` diagonal
        for (let rowDir = rowIndex, colDir = colIndex; rowDir < this.board.rows && colDir >= 0; rowDir++, colDir--) {
            console.log(rowDir, colDir, this.state.grid[rowDir][colDir]);
            isValid &&= (this.state.grid[rowDir][colDir] === null);
        }

        if (!isValid) {
            alert('error in position');
            return;
        }
        this.state.grid[rowIndex][colIndex] = this.gamePieces.queen
        this.setState({grid: this.state.grid});

    }

    drawer() {
        return super.drawer();
    }

    render() {
        return this.drawer();
    }

}

export default EightQueens;
