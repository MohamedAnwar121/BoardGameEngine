import GameEngine from "./GameEngine";
import '@fortawesome/fontawesome-free/css/all.min.css';

class TicTacToe extends GameEngine{
    constructor(props) {
        super(props);
        this.board.distributePieces = "Enter X OR O";

        this.initializeGamePieces();
        this.initializeComponentState("X");
    }

    controller(input, state) {

        console.log(state)

        let index = this.getInput(input);
        if (index === null) {
            alert("XX not valid input XX");
            return state;
        }

        let rowIndex = index[0];
        let colIndex = index[1];

        console.log(rowIndex , colIndex);

        if( state.grid[rowIndex][colIndex] !== null ){
            alert('error in position');
            return state;
        }

        state.grid[rowIndex][colIndex] = state.playerState.currentPiece;
        this.switchTurn(state);

        return state;
    }

    switchTurn(state){
        if( state.playerState.playerTurn === this.turn.player1 ){
            state.playerState.currentPiece = this.gamePieces.O;
            state.playerState.playerTurn = this.turn.player2;
        } else {
            state.playerState.currentPiece = this.gamePieces.X;
            state.playerState.playerTurn = this.turn.player1;
        }
    }

    drawer(state){
        this.setState(state);
        return super.drawer(state);
    }

    render() {return super.render()}

    initializeGamePieces() {
        this.gamePieces = {
            X: 'X',
            O: 'O'
        };
    }

    initializeComponentState(chosenPieces){

        this.setPieceScalar(0.75);
        this.setCellScalar(0.7);

        console.log(chosenPieces)
        console.log("inst state")

        this.startState(chosenPieces);
    }

    startState(chosenPieces) {
        console.log(chosenPieces)
        this.state = {
            grid: this.instantiateBoard(3, 3),
            playerState: {
                playerTurn: (chosenPieces === "X"? this.turn.player1: this.turn.player2), // must be generic
                playerPieces: {
                    player1: new Set().add(this.gamePieces.X),
                    player2: new Set().add(this.gamePieces.O)
                },
                currentPiece: (chosenPieces === "X"? "X": "O")
            }
        };
        this.initializeCellStyle();
        this.initializePiecesSource();
        return this.state;
    }
    initializePiecesSource(){
        this.piecesSource[this.gamePieces.X] = <i className="fa fa-x" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth}}></i>;
        this.piecesSource[this.gamePieces.O] = <i className="fa fa-o" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth}}></i>;
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
        if( !(0 <= a && a <= 2) )return null;
        if( !(0 <= b && b <= 2) )return null;

        return [a, b];
    }


}

export default TicTacToe;

