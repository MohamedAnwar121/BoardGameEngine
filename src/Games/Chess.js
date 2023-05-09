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
            return;
        }

        for (const [key, value] of this.pieceRule[this.state.grid[sourceX][sourceY]].entries()) {
            let destinationPointRow = null;
            let destinationPointCol = null;

            if (key.skip) {
                destinationPointRow = sourceX + key.move[0];
                destinationPointCol = sourceY + key.move[1];

                if (!this.isInRange(destinationPointRow, destinationPointCol, this.board.rows, this.board.cols)) continue;

                if (this.state.grid[destinationPointRow][destinationPointCol] === null) {
                    // update grid
                    return;
                }

                if (this.checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol)) {
                    this.pushEatenPiece(this.state.grid[destinationPointRow][destinationPointCol]);
                } else {
                    alert('can\'t eat your piece');
                    return;
                }

            } else {

                destinationPointRow = destX;
                destinationPointCol = destY;

                for (let rowIndex = sourceX, colIndex = sourceY, counter = 0;
                     counter < value && this.isInRange(rowIndex, colIndex, this.board.rows, this.board.cols);
                     rowIndex += key.move[0] , colIndex += key.move[1]) {

                    if (rowIndex === destX && colIndex === destY) {

                        if (this.state.grid[destinationPointRow][destinationPointCol] === null) {
                            // update grid
                            return;
                        } else if (
                            this.checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol)) {
                            this.pushEatenPiece(this.state.grid[destinationPointRow][destinationPointCol]);
                            // update grid
                            return;
                        } else {
                            alert('can\'t eat your piece');
                            return;
                        }
                    }

                    if (rowIndex !== destX && colIndex !== destY
                        && this.state.grid[destinationPointRow][destinationPointCol] !== null) {
                        alert('path is blocked');
                        return;
                    }

                }
            }
        }

        if (this.state.grid[sourceX][sourceY] === this.gamePieces.whitePawn
        || this.state.grid[sourceX][sourceY] === this.gamePieces.blackPawn){
            this.handlePawnMoves(this.state.grid[sourceX][sourceY] , sourceX , sourceY ,destX , destY);
        }

        // update state


    }

    isInRange(i, j, n, m) {
        return i >= 0 && j >= 0 && i < n && i < m;
    }

    checkIfOpponentPiece(playerTurnObj, playerSetObj, destinationPointRow, destinationPointCol,) {
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

        // diagonal eat [1,-1] , [1,1] , [-1,-1] , [-1,1]

        let moveSet = (piece === this.gamePieces.whitePawn) ? [[-1, 1], [-1, -1]] : [[1, -1], [1, 1]];

        for (let i = 0; i < 2; i++) {
            if (moveSet[i][0] + sourceX === destX && moveSet[i][1] + sourceY === destY){
                // update grid
                break;
            }
        }

        // double move at initial state [2 , 0] , [-2 , 0]

        if (piece === this.gamePieces.whitePawn && sourceX === 6){

            if (sourceX - 2 === destX
                && this.state.grid[4][sourceY] === null
                && this.state.grid[5][sourceY] === null ) {

                // update grid
            }

        } else if (piece === this.gamePieces.blackPawn && sourceX === 1){

            if (sourceX + 2 === destX
                && this.state.grid[2][sourceY] === null
                && this.state.grid[3][sourceY] === null ) {

                // update grid
            }
        }

        // upgrade

        if (piece === this.gamePieces.whitePawn){
            if (sourceX === 0) this.state.grid[sourceX][sourceY] = this.gamePieces.whiteQueen;
        }
        else if (piece === this.gamePieces.blackPawn){
            if (sourceX === 7) this.state.grid[sourceX][sourceY] = this.gamePieces.blackQueen;
        }
    }

    drawer() {
        return super.drawer();
    }

    render() {
        return this.drawer();
    }

    initializePiecesRules() {

        let INF = this.board.rows * this.board.cols;
        this.pieceRule = new Map();

        this.pieceRule[this.gamePieces.whitePawn] = new Map(
            [
                [{move: [-1, 0], skip: false}, 1]
            ]
        );

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
                [{move: [-1, 2], skip: true}, 1],
                [{move: [1, -2], skip: true}, 1],
                [{move: [-1, -2], skip: true}, 1]
            ]
        );

        this.pieceRule[this.gamePieces.blackPawn] = new Map(
            [
                [{move: [1, 0], skip: false}, 1]
            ]
        );

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
                    player1: new Set().add(
                        ...[
                            this.gamePieces.whitePawn,
                            this.gamePieces.whiteBishop,
                            this.gamePieces.whiteRook,
                            this.gamePieces.whiteKnight,
                            this.gamePieces.whiteQueen,
                            this.gamePieces.whiteKing
                        ]
                    ),
                    player2: new Set().add(
                        ...[
                            this.gamePieces.blackPawn,
                            this.gamePieces.blackBishop,
                            this.gamePieces.blackRook,
                            this.gamePieces.blackKnight,
                            this.gamePieces.blackQueen,
                            this.gamePieces.blackKing
                        ]
                    )
                },
                piecesEaten: {
                    player1: [],
                    player2: []
                }
            }
        };
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

    // 11A 3C
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
