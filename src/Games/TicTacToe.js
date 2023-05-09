import GameEngine from "./GameEngine";
import '@fortawesome/fontawesome-free/css/all.min.css';

class TicTacToe extends GameEngine{

    initializeGamePieces() {
        this.gamePieces = {
            X: 'X',
            O: 'O'
        };
    }

    initializeComponentState(){

        this.setPieceScalar(0.75);
        this.setCellScalar(0.7);

        this.state = {
            grid: this.instantiateBoard(3, 3),
            playerState: {
                playerTurn: this.turn.player1, // must be generic
                playerPieces: {
                    player1: new Set().add(this.gamePieces.X),
                    player2: new Set().add(this.gamePieces.O)
                },
                currentPiece: this.gamePieces.X
            }
        };
    }


    initializePiecesSource(){
        this.piecesSource[this.gamePieces.X] = <i className="fa fa-x" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth}}></i>;
        this.piecesSource[this.gamePieces.O] = <i className="fa fa-o" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth}}></i>;
    }

    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();
    }

    controller(input) {

        let rowIndex = input.split(/\s+/)[0];
        let colIndex = input.split(/\s+/)[1];

        console.log(rowIndex , colIndex);

        if( this.state.grid[rowIndex][colIndex] !== null ){
            alert('error in position');
            return;
        }

        this.state.grid[rowIndex][colIndex] = this.state.playerState.currentPiece;
        this.setState({ grid: this.state.grid });

        this.switchTurn();
    }

    switchTurn(){
        if( this.state.playerState.playerTurn === this.turn.player1 ){
            this.state.playerState.currentPiece = this.gamePieces.O;
            this.state.playerState.playerTurn = this.turn.player2;
        } else {
            this.state.playerState.currentPiece = this.gamePieces.X;
            this.state.playerState.playerTurn = this.turn.player1;
        }
    }

    drawer(){return super.drawer();}

    render() {return super.render()}
}

export default TicTacToe;


