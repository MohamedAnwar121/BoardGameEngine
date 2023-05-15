import GameEngine from "./GameEngine";

class EightQueens extends GameEngine {
    constructor(props) {
        super(props);
        this.singlePlayer = true;

        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializePiecesSource();
    }

    controller(input) {

        let index = this.getInput(input);
        if (index === null) {
            alert("XX not valid input XX");
            return;
        }

        let rowIndex = index[0];
        let colIndex = index[1];


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

        return this.state;
    }

    drawer(state){
        this.setState(state);
        return super.drawer();
    }

    render() {return super.render()}

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

    getInput(input) {

        // invalid case
        if(input.length === 0)return null;

        // invalid case
        if(input.split(" ").length !== 2)return null;

        const [string1, string2] = input.split(" ");

        // invalid cases
        if( isNaN(string1) )return null;
        if( !(string2.length === 1 && 'a' <= string2.toLowerCase() && string2.toLowerCase() <= 'z') )return null;

        let b = string2.toLowerCase().charCodeAt(0) - 97;
        let a = Number(string1) - 1;

        // invalid cases
        if( !(0 <= a && a <= 7) )return null;
        if( !(0 <= b && b <= 7) )return null;

        return [a, b];
    }

}

export default EightQueens;
