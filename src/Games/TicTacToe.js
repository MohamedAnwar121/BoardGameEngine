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
        this.state = {
            grid: this.instantiateBoard(3, 3),
            playerState: {
                playerTurn: this.turn.player1, // must be generic
                playerPieces: {
                    player1: new Set().add('X'),
                    player2: new Set().add('O')
                },
                currentPiece: this.gamePieces.X
            }
        };
    }


    initializePiecesSource(){
        this.piecesSource[this.gamePieces.X] = <i className="fa fa-x" style={{fontSize: "100px"}}></i>;
        this.piecesSource[this.gamePieces.O] = <i className="fa fa-o" style={{fontSize: "100px"}}></i>;
    }

    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();

        // data missing error correction
        this.controller = this.controller.bind(this);
    }

    controller(event) {
        let rowIndex = (event.currentTarget.id / this.board.cols) >> 0;
        let colIndex = (event.currentTarget.id % this.board.cols) >> 0;

        if( this.state.grid[rowIndex][colIndex] !== null ){
            alert('error in position');
            return;
        }

        this.state.grid[rowIndex][colIndex] = this.state.playerState.currentPiece;
        this.setState({ grid: this.state.grid });

        this.switchPlayer();
    }

    switchPlayer(){
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


