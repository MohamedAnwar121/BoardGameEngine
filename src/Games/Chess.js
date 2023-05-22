import GameEngine from "./GameEngine";

class Chess extends GameEngine {

    constructor(props) {
        super(props);
        this.board.distributePieces = "note: W >> white, B >> black            \n                                             << Enter W OR B >>";
        this.initializeGamePieces();
        this.initializeComponentState("W");
    }

    controller(input, state) {

        let index = this.getInput(input);
        if (index === null) {
            alert("XX not valid input XX");
            return state;
        }

        console.log(state)

        let source = index[0];
        let dest = index[1];

        let sourceX = source[0], sourceY = source[1];
        let destX = dest[0], destY = dest[1];


        let playerTurnObj = state.playerState.playerTurn;
        let playerSetObj = state.playerState.playerPieces;


        let curPlayerTurnSet = ((playerTurnObj === this.turn.player1) ? playerSetObj.player1 : playerSetObj.player2);
        if (!curPlayerTurnSet.has(state.grid[sourceX][sourceY])) {
            alert('null or opponent piece access');
            return state;
        }

        let doneAMove = false;

        for (const [key, value] of this.pieceRule[state.grid[sourceX][sourceY]].entries()) {

            let destinationPointRow = null;
            let destinationPointCol = null;

            if (key.skip) {
                destinationPointRow = sourceX + key.move[0];
                destinationPointCol = sourceY + key.move[1];


                if (!this.isInRange(destinationPointRow, destinationPointCol, this.board.rows, this.board.cols))
                    continue;

                if (destinationPointRow === destX && destinationPointCol === destY){

                    if (state.grid[destinationPointRow][destinationPointCol] === null) {

                        // update grid
                        state.grid[destinationPointRow][destinationPointCol] = state.grid[sourceX][sourceY];
                        state.grid[sourceX][sourceY] = null;
                        this.switchTurn(state);

                        doneAMove = true;
                        break;
                    }

                    if (this.checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol, state)) {
                        this.pushEatenPiece(state.grid[destinationPointRow][destinationPointCol], state);

                        // update grid
                        state.grid[destinationPointRow][destinationPointCol] = state.grid[sourceX][sourceY];
                        state.grid[sourceX][sourceY] = null;
                        this.switchTurn(state);


                        doneAMove = true;
                        break;

                    } else {
                        alert('can\'t eat your piece');
                        return state;
                    }

                }

            } else {

                destinationPointRow = destX;
                destinationPointCol = destY;

                console.log(destinationPointRow , destinationPointCol)


                if (!this.isInRange(destinationPointRow, destinationPointCol, this.board.rows, this.board.cols))
                    continue;


                for (let rowIndex = sourceX, colIndex = sourceY, counter = 0;
                     counter < value+1 && this.isInRange(rowIndex, colIndex, this.board.rows, this.board.cols);
                     rowIndex += key.move[0] , colIndex += key.move[1] , counter++) {

                    console.log(rowIndex, colIndex)

                    if (rowIndex === destinationPointRow && colIndex === destinationPointCol) {

                        if (state.grid[destinationPointRow][destinationPointCol] === null) {

                            console.log(this.state.grid)

                            // update grid
                            state.grid[destinationPointRow][destinationPointCol] = state.grid[sourceX][sourceY];
                            state.grid[sourceX][sourceY] = null;
                            this.switchTurn(state);

                            doneAMove = true;

                            break;
                        } else if (this.checkIfOpponentPiece
                        (playerTurnObj, playerSetObj, rowIndex, colIndex, state)) {

                            this.pushEatenPiece(state.grid[destinationPointRow][destinationPointCol], state);

                            console.log('inside eat');

                            // update grid
                            state.grid[destinationPointRow][destinationPointCol] = state.grid[sourceX][sourceY];
                            state.grid[sourceX][sourceY] = null;
                            this.switchTurn(state);

                            doneAMove = true;
                            break;
                        }
                        else {
                            alert('can\'t eat your piece');
                            return state;
                        }
                    }
                    else if (state.grid[rowIndex][colIndex] !== null
                        && (rowIndex !== sourceX || colIndex !== sourceY)) {
                        break;
                    }


                    // if( 0 === sourceX && sourceY === 0 && destX === 0 && destY === 3 ){
                    //     console.log(this.state.grid[rowIndex][colIndex]);
                    //     console.log(rowIndex)
                    //     console.log(colIndex)
                    //     console.log(this.state)
                    // }
                }

                if (doneAMove) break;
            }
        }

        if (state.grid[sourceX][sourceY] === this.gamePieces.whitePawn
            || state.grid[sourceX][sourceY] === this.gamePieces.blackPawn){
            doneAMove = this.handlePawnMoves(state.grid[sourceX][sourceY] , sourceX , sourceY ,destX , destY, state);
        }

        if (!doneAMove) {
            alert('invalid move');
            return state;
        }

        // update state


        // new state
        return {
            grid : state.grid,
            playerState: {
                playerTurn: state.playerState.playerTurn,
                playerPieces: {
                    player1: state.playerState.playerPieces.player1,
                    player2: state.playerState.playerPieces.player2
                },
                piecesEaten: {
                    player1: state.playerState.piecesEaten.player1,
                    player2: state.playerState.piecesEaten.player2
                }
            }
        }
    }

    drawer(state){
        this.setState(state);
        return super.drawer(state);
    }

    isInRange(i, j, n, m) {
        return i >= 0 && j >= 0 && i < n && i < m;
    }
    checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol, state) {

        console.log(playerTurnObj , playerSetObj);

        console.log(destinationPointRow, destinationPointCol)

        console.log(state)

        console.log(state.grid[destinationPointRow][destinationPointCol])
        if (playerTurnObj === this.turn.player1) {
            console.log(playerSetObj.player2.has(state.grid[destinationPointRow][destinationPointCol]))
        } else {
            console.log(playerSetObj.player1.has(state.grid[destinationPointRow][destinationPointCol]))
        }

        return ((playerTurnObj === this.turn.player1)
            ? playerSetObj.player2 : playerSetObj.player1)
            .has(state.grid[destinationPointRow][destinationPointCol])
    }
    pushEatenPiece(val, state) {
        let piecesEaten = state.playerState.piecesEaten;
        if (state.playerState.playerTurn === this.turn.player1)
            piecesEaten.player1.push(val);
        else
            piecesEaten.player2.push(val);
    }
    handlePawnMoves(piece, sourceX, sourceY, destX, destY, state) {

        let doneAMove = false;

        // normal move [1,0] , [-1,0]

        let moveSet = (piece === this.gamePieces.whitePawn) ? [-1,0] : [1,0];

        if (sourceX + moveSet[0]  === destX &&  sourceY + moveSet[1] === destY){

            if (state.grid[destX][destY] === null) {
                // update grid

                state.grid[destX][destY] = state.grid[sourceX][sourceY];
                state.grid[sourceX][sourceY] = null;
                this.switchTurn(state);

                doneAMove = true;
            }

        }


        // diagonal eat [1,-1] , [1,1] , [-1,-1] , [-1,1]

        moveSet = (piece === this.gamePieces.whitePawn) ? [[-1, 1], [-1, -1]] : [[1, -1], [1, 1]];

        for (let i = 0; i < 2; i++) {
            if (moveSet[i][0] + sourceX === destX && moveSet[i][1] + sourceY === destY
                && this.checkIfOpponentPiece(state.playerState.playerTurn ,
                    state.playerState.playerPieces ,
                    destX,destY, state)) {
                this.pushEatenPiece(state.grid[destX][destY], state);

                // update grid
                state.grid[destX][destY] = state.grid[sourceX][sourceY];
                state.grid[sourceX][sourceY] = null;
                this.switchTurn(state);

                doneAMove = true;

                break;
            }
        }

        // double move at initial state [2 , 0] , [-2 , 0]

        if (piece === this.gamePieces.whitePawn && sourceX === 6){

            if (sourceX - 2 === destX
                && state.grid[4][sourceY] === null
                && state.grid[5][sourceY] === null ) {

                // update grid
                state.grid[destX][destY] = state.grid[sourceX][sourceY];
                state.grid[sourceX][sourceY] = null;
                this.switchTurn(state);

                doneAMove = true;
            }

        } else if (piece === this.gamePieces.blackPawn && sourceX === 1){

            if (sourceX + 2 === destX
                && state.grid[2][sourceY] === null
                && state.grid[3][sourceY] === null ) {

                // update grid
                state.grid[destX][destY] = state.grid[sourceX][sourceY];
                state.grid[sourceX][sourceY] = null;
                this.switchTurn(state);

                doneAMove = true;
            }
        }

        // upgrade

        if (doneAMove){
            if (piece === this.gamePieces.whitePawn){
                if (destX === 0) state.grid[destX][destY] = this.gamePieces.whiteQueen;
            }
            else if (piece === this.gamePieces.blackPawn){
                if (destX === 7) state.grid[destX][destY] = this.gamePieces.blackQueen;
            }
        }


        return doneAMove;
    }

    switchTurn(state) {
        state.playerState.playerTurn =
            (state.playerState.playerTurn === this.turn.player1 ? this.turn.player2 : this.turn.player1);
    }

/////////////////////////////////////////////////////////////////
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

    initializeComponentState(chosenPieces) {
        this.setIsAlternating(true);
        this.board.baseColor = '#00ffff';
        this.board.alternatingColor = '#002260';
        this.setPieceScalar(0.7);

        this.startState(chosenPieces);

    }
    startState(chosenPieces) {
        console.log(chosenPieces)
        this.state = {
            grid: this.instantiateBoard(8, 8),
            playerState: {
                playerTurn: (chosenPieces === "W"? this.turn.player1: this.turn.player2),
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
        this.initializeGridWithInitialState();
        this.initializeCellStyle();
        this.initializePiecesSource();
        this.initializePiecesRules();
        return this.state;
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
        // invalid case
        if(input.length === 0)return null;

        // invalid case
        if(input.split(" ").length !== 4)return null;

        const [string1, string2, string3, string4] = input.split(" ");

        console.log(string1, string2, string3, string4)

        // invalid cases
        if( isNaN(string1) )return null;
        if( isNaN(string3) )return null;
        if( !(string2.length === 1 && 'a' <= string2.toLowerCase() && string2.toLowerCase() <= 'z') )return null;
        if( !(string4.length === 1 && 'a' <= string4.toLowerCase() && string4.toLowerCase() <= 'z') )return null;

        let b = string2.toLowerCase().charCodeAt(0) - 97;
        let a = Number(string1) - 1;

        let d = string4.toLowerCase().charCodeAt(0) - 97;
        let c = Number(string3) - 1;

        // invalid cases
        if( !(0 <= a && a <= 7) )return null;
        if( !(0 <= b && b <= 7) )return null;
        if( !(0 <= c && c <= 7) )return null;
        if( !(0 <= d && d <= 7) )return null;

        return [[a, b], [c, d]];
    }
}

export default Chess;





