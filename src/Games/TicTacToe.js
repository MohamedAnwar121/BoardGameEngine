import GameEngine from "./GameEngine";

class TicTacToe extends GameEngine{
    playerTurn = '';

    constructor(props) {
        super(props);
        this.state = {grid: this.instantiateBoard(6, 7)};
        this.playerTurn = this.turn.player1;
        this.controller();
        this.cellStyle = {
            backgroundColor: 'white',
            margin: "5px",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '30px',
            width: 600 / this.board.cols,
            height: 600 / this.board.cols,
        }
    }

    controller(){

    }

    drawer(){
        return super.drawer();
    }

    render() {return super.render()}

}

export default TicTacToe;


