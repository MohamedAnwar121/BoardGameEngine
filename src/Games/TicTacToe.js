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
    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();

        this.pieces[this.gamePieces.X] = <i className="fa fa-x" style={{fontSize: "100px"}}></i>;
        this.pieces[this.gamePieces.O] = <i className="fa fa-o" style={{fontSize: "100px"}}></i>;

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


        let newGrid = this.state.grid.map(row => [...row]);
        newGrid[rowIndex][colIndex] = this.state.currentPiece;
        this.setState({ grid: newGrid });
        this.switchPlayer();
    }

    switchPlayer(){
        if( this.state.playerState.playerTurn === this.turn.player1 ){
            this.state.playerState.playerTurn = this.turn.player2;
            this.state.playerState.currentPiece = this.gamePieces.O;
        } else {
            this.state.playerState.playerTurn = this.turn.player1;
            this.state.playerState.currentPiece = this.gamePieces.X;
        }
    }

    drawer(){
        return super.drawer();
    }

    render() {return super.render()}

}

export default TicTacToe;


