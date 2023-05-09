import GameEngine from "./GameEngine";

class Chess extends GameEngine {

    constructor(props) {
        super(props);

        this.initializeGamePieces();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();
        this.initializeGridWithInitialState();
        this.initializePiecesRules();
    }

    controller(input) {
        let index = this.getInput(input);
        let source = index[0];
        let dest = index[1];

        let sourceX = source[0], sourceY = source[1];
        let destX = dest[0], destY = dest[1];


        let playerTurnObj = this.state.playerState.playerTurn;
        let playerSetObj = this.state.playerState.playerPieces;


        let curPlayerTurnSet = ((playerTurnObj === this.turn.player1) ? playerSetObj.player1 : playerSetObj.player2);
        if (!curPlayerTurnSet.has(this.state.grid[sourceX][sourceY])) {
            alert('null or opponent piece access');
            return this.state;
        }

        let doneAMove = false;

        for (const [key, value] of this.pieceRule[this.state.grid[sourceX][sourceY]].entries()) {

            let destinationPointRow = null;
            let destinationPointCol = null;

            if (key.skip) {
                destinationPointRow = sourceX + key.move[0];
                destinationPointCol = sourceY + key.move[1];


                if (!this.isInRange(destinationPointRow, destinationPointCol, this.board.rows, this.board.cols))
                    continue;

                if (destinationPointRow === destX && destinationPointCol === destY){

                    if (this.state.grid[destinationPointRow][destinationPointCol] === null) {

                        // update grid
                        this.state.grid[destinationPointRow][destinationPointCol] = this.state.grid[sourceX][sourceY];
                        this.state.grid[sourceX][sourceY] = null;
                        this.switchTurn();

                        doneAMove = true;
                        break;
                    }

                    if (this.checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol)) {
                        this.pushEatenPiece(this.state.grid[destinationPointRow][destinationPointCol]);

                        // update grid
                        this.state.grid[destinationPointRow][destinationPointCol] = this.state.grid[sourceX][sourceY];
                        this.state.grid[sourceX][sourceY] = null;
                        this.switchTurn();


                        doneAMove = true;
                        break;

                    } else {
                        alert('can\'t eat your piece');
                        return this.state;
                    }

                }

            } else {

                destinationPointRow = destX;
                destinationPointCol = destY;

                console.log(destinationPointRow , destinationPointCol)


                if (!this.isInRange(destinationPointRow, destinationPointCol, this.board.rows, this.board.cols))
                    continue;


                for (let rowIndex = sourceX, colIndex = sourceY, counter = 0;
                     counter < value && this.isInRange(rowIndex, colIndex, this.board.rows, this.board.cols);
                     rowIndex += key.move[0] , colIndex += key.move[1] , counter++) {


                    if (rowIndex === destinationPointRow && colIndex === destinationPointCol) {

                        if (this.state.grid[destinationPointRow][destinationPointCol] === null) {

                            console.log(this.state.grid)

                            // update grid
                            this.state.grid[destinationPointRow][destinationPointCol] = this.state.grid[sourceX][sourceY];
                            this.state.grid[sourceX][sourceY] = null;
                            this.switchTurn();

                            doneAMove = true;

                            break;
                        } else if (this.checkIfOpponentPiece
                        (playerTurnObj, playerSetObj, rowIndex, colIndex)) {

                            this.pushEatenPiece(this.state.grid[destinationPointRow][destinationPointCol]);

                            console.log('inside eat');

                            // update grid
                            this.state.grid[destinationPointRow][destinationPointCol] = this.state.grid[sourceX][sourceY];
                            this.state.grid[sourceX][sourceY] = null;
                            this.switchTurn();

                            doneAMove = true;
                            break;
                        }
                        else {
                            alert('can\'t eat your piece');
                            return this.state;
                        }
                    } else if (this.state.grid[rowIndex][colIndex] !== null
                        && (rowIndex !== sourceX || colIndex !== sourceY)) {
                        break;
                    }


                    if( 0 === sourceX && sourceY === 0 && destX === 0 && destY === 3 ){
                        console.log(this.state.grid[rowIndex][colIndex]);
                        console.log(rowIndex)
                        console.log(colIndex)
                        console.log(this.state)
                    }
                }

                if (doneAMove) break;
            }
        }

        if (this.state.grid[sourceX][sourceY] === this.gamePieces.whitePawn
            || this.state.grid[sourceX][sourceY] === this.gamePieces.blackPawn){
            doneAMove = this.handlePawnMoves(this.state.grid[sourceX][sourceY] , sourceX , sourceY ,destX , destY);
        }

        if (!doneAMove) {
            alert('invalid move');
            return this.state;
        }

        // update state

        console.log(this.state.playerState);

        // new state
        return {
            grid : this.state.grid,
            playerState: {
                playerTurn: this.state.playerState.playerTurn,
                playerPieces: {
                    player1: this.state.playerState.playerPieces.player1,
                    player2: this.state.playerState.playerPieces.player2
                },
                piecesEaten: {
                    player1: this.state.playerState.piecesEaten.player1,
                    player2: this.state.playerState.piecesEaten.player2
                }
            }
        }
    }

    isInRange(i, j, n, m) {
        return i >= 0 && j >= 0 && i < n && i < m;
    }

    checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol) {

        console.log(playerTurnObj , playerSetObj);

        console.log(destinationPointRow, destinationPointCol)

        console.log(this.state)

        console.log(this.state.grid[destinationPointRow][destinationPointCol])
        if (playerTurnObj === this.turn.player1) {
            console.log(playerSetObj.player2.has(this.state.grid[destinationPointRow][destinationPointCol]))
        } else {
            console.log(playerSetObj.player1.has(this.state.grid[destinationPointRow][destinationPointCol]))
        }

        return ((playerTurnObj === this.turn.player1)
            ? playerSetObj.player2 : playerSetObj.player1)
            .has(this.state.grid[destinationPointRow][destinationPointCol])
    }

    pushEatenPiece(val) {
        let piecesEaten = this.state.playerState.piecesEaten;
        if (this.state.playerState.playerTurn === this.turn.player1)
            piecesEaten.player1.push(val);
        else
            piecesEaten.player2.push(val);
    }

    handlePawnMoves(piece, sourceX, sourceY, destX, destY) {

        let doneAMove = false;

        // normal move [1,0] , [-1,0]

        let moveSet = (piece === this.gamePieces.whitePawn) ? [-1,0] : [1,0];

        if (sourceX + moveSet[0]  === destX &&  sourceY + moveSet[1] === destY){

            if (this.state.grid[destX][destY] === null) {
                // update grid

                this.state.grid[destX][destY] = this.state.grid[sourceX][sourceY];
                this.state.grid[sourceX][sourceY] = null;
                this.switchTurn();

                doneAMove = true;
            }

        }


        // diagonal eat [1,-1] , [1,1] , [-1,-1] , [-1,1]

        moveSet = (piece === this.gamePieces.whitePawn) ? [[-1, 1], [-1, -1]] : [[1, -1], [1, 1]];

        for (let i = 0; i < 2; i++) {
            if (moveSet[i][0] + sourceX === destX && moveSet[i][1] + sourceY === destY
                && this.checkIfOpponentPiece(this.state.playerState.playerTurn ,
                    this.state.playerState.playerPieces ,
                    destX,destY)) {
                this.pushEatenPiece(this.state.grid[destX][destY]);

                // update grid
                this.state.grid[destX][destY] = this.state.grid[sourceX][sourceY];
                this.state.grid[sourceX][sourceY] = null;
                this.switchTurn();

                doneAMove = true;

                break;
            }
        }

        // double move at initial state [2 , 0] , [-2 , 0]

        if (piece === this.gamePieces.whitePawn && sourceX === 6){

            if (sourceX - 2 === destX
                && this.state.grid[4][sourceY] === null
                && this.state.grid[5][sourceY] === null ) {

                // update grid
                this.state.grid[destX][destY] = this.state.grid[sourceX][sourceY];
                this.state.grid[sourceX][sourceY] = null;
                this.switchTurn();

                doneAMove = true;
            }

        } else if (piece === this.gamePieces.blackPawn && sourceX === 1){

            if (sourceX + 2 === destX
                && this.state.grid[2][sourceY] === null
                && this.state.grid[3][sourceY] === null ) {

                // update grid
                this.state.grid[destX][destY] = this.state.grid[sourceX][sourceY];
                this.state.grid[sourceX][sourceY] = null;
                this.switchTurn();

                doneAMove = true;
            }
        }

        // upgrade

        if (doneAMove){
            if (piece === this.gamePieces.whitePawn){
                if (destX === 0) this.state.grid[destX][destY] = this.gamePieces.whiteQueen;
            }
            else if (piece === this.gamePieces.blackPawn){
                if (destX === 7) this.state.grid[destX][destY] = this.gamePieces.blackQueen;
            }
        }


        return doneAMove;
    }

    switchTurn() {
        this.state.playerState.playerTurn =
            (this.state.playerState.playerTurn === this.turn.player1 ? this.turn.player2 : this.turn.player1);
    }


    drawer(state){
        this.setState(state);
        return super.drawer();
    }

    render() {return super.render()}

    initializePiecesRules() {

        let INF = this.board.rows * this.board.cols;
        this.pieceRule = new Map();

        this.pieceRule[this.gamePieces.whitePawn] = new Map();

        this.pieceRule[this.gamePieces.whiteRook] = new Map(
            [
                [{move: [1, 0], skip: false}, INF],
                [{move: [0, 1], skip: false}, INF],
                [{move: [-1, 0], skip: false}, INF],
                [{move: [0, -1], skip: false}, INF]
            ]
        );

        this.pieceRule[this.gamePieces.whiteBishop] = new Map(
            [
                [{move: [1, 1], skip: false}, INF],
                [{move: [-1, 1], skip: false}, INF],
                [{move: [1, -1], skip: false}, INF],
                [{move: [-1, -1], skip: false}, INF]
            ]
        );

        this.pieceRule[this.gamePieces.whiteKing] = new Map(
            [
                [{move: [1, 1], skip: false}, 1],
                [{move: [-1, 1], skip: false}, 1],
                [{move: [1, -1], skip: false}, 1],
                [{move: [-1, -1], skip: false}, 1],
                [{move: [1, 0], skip: false}, 1],
                [{move: [0, 1], skip: false}, 1],
                [{move: [-1, 0], skip: false}, 1],
                [{move: [0, -1], skip: false}, 1]
            ]
        );

        this.pieceRule[this.gamePieces.whiteQueen] = new Map(
            [
                ...this.pieceRule[this.gamePieces.whiteRook],
                ...this.pieceRule[this.gamePieces.whiteBishop]
            ]);

        this.pieceRule[this.gamePieces.whiteKnight] = new Map(
            [
                [{move: [2, 1], skip: true}, 1],
                [{move: [2, -1], skip: true}, 1],
                [{move: [-2, 1], skip: true}, 1],
                [{move: [-2, -1], skip: true}, 1],
                [{move: [1, 2], skip: true}, 1],
                [{move: [1, -2], skip: true}, 1],
                [{move: [-1, -2], skip: true}, 1],
                [{move: [-1, -2], skip: true}, 1]
            ]
        );

        this.pieceRule[this.gamePieces.blackPawn] = new Map();

        this.pieceRule[this.gamePieces.blackRook] = new Map(this.pieceRule[this.gamePieces.whiteRook]);
        this.pieceRule[this.gamePieces.blackBishop] = new Map(this.pieceRule[this.gamePieces.whiteBishop]);
        this.pieceRule[this.gamePieces.blackKing] = new Map(this.pieceRule[this.gamePieces.whiteKing]);
        this.pieceRule[this.gamePieces.blackQueen] = new Map(this.pieceRule[this.gamePieces.whiteQueen]);
        this.pieceRule[this.gamePieces.blackKnight] = new Map(this.pieceRule[this.gamePieces.whiteKnight]);
    }

    initializeGridWithInitialState() {
        this.state.grid[0] = [
            this.gamePieces.blackRook, this.gamePieces.blackKnight, this.gamePieces.blackBishop,
            this.gamePieces.blackQueen, this.gamePieces.blackKing, this.gamePieces.blackBishop,
            this.gamePieces.blackKnight, this.gamePieces.blackRook];

        this.state.grid[1] = [
            this.gamePieces.blackPawn, this.gamePieces.blackPawn, this.gamePieces.blackPawn,
            this.gamePieces.blackPawn, this.gamePieces.blackPawn, this.gamePieces.blackPawn,
            this.gamePieces.blackPawn, this.gamePieces.blackPawn];

        this.state.grid[6] = [
            this.gamePieces.whitePawn, this.gamePieces.whitePawn, this.gamePieces.whitePawn,
            this.gamePieces.whitePawn, this.gamePieces.whitePawn, this.gamePieces.whitePawn,
            this.gamePieces.whitePawn, this.gamePieces.whitePawn];

        this.state.grid[7] = [
            this.gamePieces.whiteRook, this.gamePieces.whiteKnight, this.gamePieces.whiteBishop,
            this.gamePieces.whiteQueen, this.gamePieces.whiteKing, this.gamePieces.whiteBishop,
            this.gamePieces.whiteKnight, this.gamePieces.whiteRook];
    }

    initializeGamePieces() {
        this.gamePieces = {
            whiteRook: 'whiteRook',
            whiteKnight: 'whiteKnight',
            whiteBishop: 'whiteBishop',
            whiteQueen: 'whiteQueen',
            whiteKing: 'whiteKing',
            whitePawn: 'whitePawn',
            blackRook: 'blackRook',
            blackKnight: 'blackKnight',
            blackBishop: 'blackBishop',
            blackQueen: 'blackQueen',
            blackKing: 'blackKing',
            blackPawn: 'blackPawn'
        };

    }

    initializeComponentState() {
        this.setIsAlternating(true);
        this.board.baseColor = '#00ffff';
        this.board.alternatingColor = '#002260';
        this.setPieceScalar(0.7);

        this.state = {
            grid: this.instantiateBoard(8, 8),
            playerState: {
                playerTurn: this.turn.player1,
                playerPieces: {
                    player1: new Set(
                        [...[
                            this.gamePieces.whitePawn,
                            this.gamePieces.whiteBishop,
                            this.gamePieces.whiteRook,
                            this.gamePieces.whiteKnight,
                            this.gamePieces.whiteQueen,
                            this.gamePieces.whiteKing
                        ]]
                    ),
                    player2: new Set(
                        [...[
                            this.gamePieces.blackPawn,
                            this.gamePieces.blackBishop,
                            this.gamePieces.blackRook,
                            this.gamePieces.blackKnight,
                            this.gamePieces.blackQueen,
                            this.gamePieces.blackKing
                        ]]
                    )
                },
                piecesEaten: {
                    player1: [],
                    player2: []
                }
            }
        };

        console.log(this.state);
    }

    initializePiecesSource() {
        Object.keys(this.gamePieces).forEach((piece) => {
            const pieceName = piece.replace('white', '')
                .replace('black', '').toLowerCase();

            const color = piece.includes('white') ? 'white' : 'black';
            this.piecesSource[this.gamePieces[piece]] = (
                <i className={`fa fa-chess-${pieceName}`} style={{
                    color: color,
                    fontSize: this.board.pieceScalar * this.board.cellWidth
                }}></i>
            );
        });
    }

    getInput(input) {
        const [string1, string2] = input.split(" ");

        let b = string1[string1.length - 1].toLowerCase().charCodeAt(0) - 97;
        let a = Number(string1.substring(0, string1.length - 1)) - 1;

        let d = string2[string2.length - 1].toLowerCase().charCodeAt(0) - 97;
        let c = Number(string2.substring(0, string1.length - 1)) - 1;

        return [[a, b], [c, d]];
    }
}

export default Chess;





