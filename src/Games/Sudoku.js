import GameEngine from "./GameEngine";
import SudokuGenerator from "./SudokuGenerator";

class Sudoku extends GameEngine {

    constructor(props) {
        super(props);
        this.singlePlayer = true;

        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();
        this.initializeGridWithKEmptyCells(40);

        this.controller = this.controller.bind(this);
        this.recordInput = this.recordInput.bind(this);
    }

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
        this.setPieceScalar(0.8);

        this.state = {
            grid: this.instantiateBoard(9, 9),
            input: null
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

    setRowLineWidth(i) {
        for (let j = 0; j < this.board.cols; j++)
            if (i !== this.board.cols - 1)
                this.board.buttonsReferenceGrid[j][i].style.borderRightWidth = '4px';
    }

    setColLineWidth(j) {
        for (let i = 0; i < this.board.rows; i++)
            if (j !== this.board.cols - 1)
                this.board.buttonsReferenceGrid[j][i].style.borderBottomWidth = '4px';
    }

    controller(event) {
        let rowIndex = (event.currentTarget.id / this.board.cols) >> 0;
        let colIndex = (event.currentTarget.id % this.board.cols) >> 0;


        console.log(this.state.grid[rowIndex][colIndex] , this.initialGrid[rowIndex][colIndex])
        if (this.state.grid[rowIndex][colIndex] !== 0 &&
            this.state.grid[rowIndex][colIndex] === this.initialGrid[rowIndex][colIndex]) {
            alert('cannot be overridden');
            return;
        }

        console.log(this.rowSet);
        console.log(this.colSet);
        console.log(this.squareSet);

        if (this.state.input === null) {
            alert('pick a number first');
            return;
        }

        if (this.rowSet[rowIndex].has(parseInt(this.state.input))) {
            alert('error in position');
            return;
        }

        if (this.colSet[colIndex].has(parseInt(this.state.input))) {
            alert('error in position');
            return;
        }

        let squareIndex =
            (Math.floor(rowIndex / 3)) * this.board.cols / 3 + Math.floor(colIndex / 3);

        if (this.squareSet[squareIndex].has(parseInt(this.state.input))) {
            alert('error in position');
            return;
        }

        if (this.state.grid[rowIndex][colIndex] !== 0){
            this.rowSet[rowIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
            this.colSet[colIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
            this.squareSet[squareIndex].delete(parseInt(this.state.grid[rowIndex][colIndex]));
        }

        this.state.grid[rowIndex][colIndex] = this.state.input;
        this.setState({grid: this.state.grid});

        this.rowSet[rowIndex].add(parseInt(this.state.input));
        this.colSet[colIndex].add(parseInt(this.state.input));
        this.squareSet[squareIndex].add(parseInt(this.state.input));
    }


    drawer() {
        const buttons = [];
        for (let i = 0; i < 9; i++)
            buttons.push(<button key={i}
                                 style={this.initializeCellStyle(i, i)}
                                 id={String(i + 1)}
                                 onClick={this.recordInput}>{i + 1}</button>);
        return <>
            {super.drawer()}
            <span>
                {buttons}
            </span>
        </>
        // return super.drawer();
    }

    recordInput(event) {
        this.state.input = event.currentTarget.id;
        this.setState({input: this.state.input});
    }

    componentDidMount() {
        for (let i = 2; i < this.board.cols; i += 3) {
            this.setRowLineWidth(i);
            this.setColLineWidth(i);
        }
    }

    render() {
        return super.render();
    }

}

export default Sudoku;
