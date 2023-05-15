import GameEngine from "./GameEngine";


// out of range handle.
// circles handle.
class ConnectFour extends GameEngine{

    constructor(props) {
        super(props);
        this.board.distributePieces = "note: R >> red, Y >> yellow            \n                                             << Enter R OR Y >>";


        this.initializeGamePieces();
        this.initializeComponentState("R");
        this.controller = this.controller.bind(this);
    }
    controller(input){

        console.log(this.state)

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

    initializeGamePieces() {
        this.gamePieces = {
            redCircle: 'redCircle',
            yellowCircle: 'yellowCircle'
        };
    }

    initializeComponentState(chosenPieces) {

        this.setPieceScalar(1);
        this.board.isCircular = true;
        this.board.showBoardNumbers = false;

        this.startState(chosenPieces);

        this.lastCircleOnEachCol = new Array(7).fill(this.board.rows - 1);
    }

    startState(chosenPieces) {
        console.log(chosenPieces)
        this.state = {
            grid: this.instantiateBoard(6, 7),
            playerState: {
                playerTurn: (chosenPieces === "R"? this.turn.player1: this.turn.player2),
                playerPieces: {
                    player1: new Set().add(this.gamePieces.redCircle),
                    player2: new Set().add(this.gamePieces.yellowCircle)
                },
                currentPiece: (chosenPieces === "R"? this.gamePieces.redCircle: this.gamePieces.yellowCircle)
            },
        }
        this.initializeCellStyle();
        this.initializePiecesSource();
        return this.state;
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
}

export default ConnectFour;
