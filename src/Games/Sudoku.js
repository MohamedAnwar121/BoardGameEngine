import GameEngine from "./GameEngine";
import SudokuGenerator from "./SudokuGenerator";

class Sudoku extends GameEngine {

    constructor(props) {
        super(props);
        this.singlePlayer = true;
        this.board.

        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();
        this.initializeGridWithKEmptyCells(40);

        this.controller = this.controller.bind(this);
        this.recordInput = this.recordInput.bind(this);
    }

    getInput(input) {
        // a >> row.
        // b >> col.
        // c >> number inserted.

        const [string1, string2] = input.split(" ");

        let b = string1[ string1.length - 1 ].toLowerCase().charCodeAt(0) - 97;
        let a = Number(string1.substring(0, string1.length - 1)) - 1;
        let c = Number(string2);

        if (!(c >= 0 && c <= 9)) {
            alert('enter a valid number');
            return null;
        }

        return [a, b, c];
    }
    controller(input) {

        if (this.getInput(input) === null) return;

        let rowIndex = this.getInput(input)[0];
        let colIndex = this.getInput(input)[1];
        let numberInserted = this.getInput(input)[2];


        if (this.state.grid[rowIndex][colIndex] !== 0 &&
            this.state.grid[rowIndex][colIndex] === this.initialGrid[rowIndex][colIndex]) {
            alert('cannot be overridden');
            return;
        }


        if (this.rowSet[rowIndex].has(numberInserted)) {
            alert('error in position');
            return;
        }

        if (this.colSet[colIndex].has(numberInserted)) {
            alert('error in position');
            return;
        }

        let squareIndex =
            (Math.floor(rowIndex / 3)) * this.board.cols / 3 + Math.floor(colIndex / 3);

        if (this.squareSet[squareIndex].has(numberInserted)) {
            alert('error in position');
            return;
        }

        if (this.state.grid[rowIndex][colIndex] !== 0){
            this.rowSet[rowIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
            this.colSet[colIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
            this.squareSet[squareIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
        }

        this.state.grid[rowIndex][colIndex] = numberInserted;
        // this.setState({grid: this.state.grid});

        this.rowSet[rowIndex].add(numberInserted);
        this.colSet[colIndex].add(numberInserted);
        this.squareSet[squareIndex].add(numberInserted);

        return this.state;
    }

    recordInput(event) {
        this.state.input = event.currentTarget.id;
        this.setState({input: this.state.input});
    }


    drawer(state){
        this.setState(state);
        return super.drawer();
    }

    render() {return super.render()}

    initializeGamePieces() {
        this.gamePieces = {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9'
        };
    }

    initializeComponentState() {
        this.setPieceScalar(0.7);
        this.board.setColIndexesForWidth = [2, 5];
        this.board.setRowIndexesForWidth = [2, 5];

        this.board.borderRightWidth = '5px';
        this.board.borderBottomWidth = '5px';

        this.board.cellMargin = 4;

        this.state = {
            grid: this.instantiateBoard(9, 9)
        };
    }


    initializePiecesSource() {
        for (let i = 1; i <= this.board.rows; i++) {
            this.piecesSource[this.gamePieces[i]] =
                <i style={
                    {
                        fontSize: this.board.pieceScalar * this.board.cellWidth,
                        fontStyle: "normal"
                    }
                }> {i} </i>;
        }
    }

    initializeGridWithKEmptyCells(k) {

        // grid initial state.
        const sudoku = new SudokuGenerator(9, k);
        this.state.grid = sudoku.generateSudoku();

        this.rowSet = Array.from({length: this.board.rows}, () => new Set());
        this.colSet = Array.from({length: this.board.cols}, () => new Set());
        this.squareSet = Array.from({
            length: this.board.cols / 3 * this.board.rows / 3
        }, () => new Set());


        for (let i = 0; i < this.board.rows; i++) {
            for (let j = 0; j < this.board.cols; j++) {

                if ( this.state.grid[i][j] === 0) continue;

                this.rowSet[i].add(this.state.grid[i][j]);
                this.colSet[j].add(this.state.grid[i][j]);

                let squareIndex = (Math.floor(i / 3)) * this.board.cols / 3 + Math.floor(j / 3);
                this.squareSet[squareIndex].add(this.state.grid[i][j]);
            }
        }

        this.initialGrid = this.state.grid.map((row) => [...row]);
    }

}

export default Sudoku;
