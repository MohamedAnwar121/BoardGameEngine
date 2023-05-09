import GameEngine from "./GameEngine";

class ConnectFour extends GameEngine{

    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();

        this.controller = this.controller.bind(this);
    }

    initializeGamePieces() {
        this.gamePieces = {
            redCircle: 'redCircle',
            yellowCircle: 'yellowCircle'
        };
    }

    initializeComponentState() {

        this.setPieceScalar(1);

        this.state = {
            grid: this.instantiateBoard(6, 7),
            playerState: {
                playerTurn: this.turn.player1,
                playerPieces: {
                    player1: new Set().add(this.gamePieces.redCircle),
                    player2: new Set().add(this.gamePieces.yellowCircle)
                },
                currentPiece: this.gamePieces.redCircle
            },
        };

        this.lastCircleOnEachCol = new Array(7).fill(this.board.rows - 1);
    }


    initializePiecesSource() {
        this.piecesSource[this.gamePieces.redCircle] = <i className="fa fa-circle" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth,
                color: 'red'}}></i>;
        this.piecesSource[this.gamePieces.yellowCircle] = <i className="fa fa-circle" style=
            {{fontSize: this.board.pieceScalar * this.board.cellWidth,
                color: 'yellow'}}></i>;
    }

    getInput(input) {

        let b = input[input.length - 1].toLowerCase().charCodeAt(0) - 97;
        let a = Number(input.substring(0, input.length - 1)) - 1;

        return [a, b];
    }

    controller(input){

        let rowIndex = this.getInput(input)[0];
        let colIndex = this.getInput(input)[1];


        if( this.state.grid[rowIndex][colIndex] !== null ){
            alert('error in position');
            return;
        }

        let newRowIndex = Math.max(this.lastCircleOnEachCol[colIndex],rowIndex);
        this.lastCircleOnEachCol[colIndex] = Math.max(newRowIndex-1,0);

        this.state.grid[newRowIndex][colIndex] = this.state.playerState.currentPiece;
        // this.setState({ grid: this.state.grid });

        this.switchTurn();

        return this.state;
    }

    switchTurn(){
        if( this.state.playerState.playerTurn === this.turn.player1 ){
            this.state.playerState.currentPiece = this.gamePieces.yellowCircle;
            this.state.playerState.playerTurn = this.turn.player2;
        } else {
            this.state.playerState.currentPiece = this.gamePieces.redCircle;
            this.state.playerState.playerTurn = this.turn.player1;
        }
    }

    drawer(state){
        this.setState(state);
        return super.drawer();
    }

    render() {return super.render()}
}

export default ConnectFour;
