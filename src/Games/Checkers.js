import GameEngine from "./GameEngine";

class Checkers extends GameEngine{

    initializeGamePieces() {
        this.gamePieces = {
            BLACKMAN: 'black-man',
            BLACKKING: 'black-king',
            WHITEMAN: 'white-man',
            WHITEKING: 'white-king'
        };
    }

    initializePiecesRules() {
        // there is a difference between map and js object.
            // map >> [ <type A> ] = <type B>
            // Object >> constant value: <type A>
        let largeNumber = 100;
        this.pieceRule = new Map();
        this.pieceRule[ this.gamePieces.BLACKMAN ] = new Map();
            this.pieceRule[ this.gamePieces.BLACKMAN ].set({ move: [1, 1], skip: false }, 1);
            this.pieceRule[ this.gamePieces.BLACKMAN ].set({ move: [1, -1], skip: false }, 1);
            this.pieceRule[ this.gamePieces.BLACKMAN ].set({ move: [2, 2], skip: true }, largeNumber);
            this.pieceRule[ this.gamePieces.BLACKMAN ].set({ move: [2, -2], skip: true }, largeNumber);
        this.pieceRule[ this.gamePieces.WHITEMAN ] = new Map();
            this.pieceRule[ this.gamePieces.WHITEMAN ].set({ move: [-1, 1], skip: false }, 1);
            this.pieceRule[ this.gamePieces.WHITEMAN ].set({ move: [-1,-1], skip: false }, 1);
            this.pieceRule[ this.gamePieces.WHITEMAN ].set({ move: [-2, -2], skip: true }, largeNumber);
            this.pieceRule[ this.gamePieces.WHITEMAN ].set({ move: [-2, 2], skip: true }, largeNumber);
        this.pieceRule[ this.gamePieces.BLACKKING ] = new Map([...this.pieceRule[ this.gamePieces.BLACKMAN ], ...this.pieceRule[ this.gamePieces.WHITEMAN ]]);
        this.pieceRule[ this.gamePieces.WHITEKING ] = new Map( this.pieceRule[ this.gamePieces.BLACKKING ] );
    }

    initializeComponentState() {
        let usedGrid = this.instantiateBoard(8, 8)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                usedGrid[i][j] = ( ((i + j) % 2 === 1)? this.gamePieces.BLACKMAN : null );
            }
        }

        for (let i = 5; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                usedGrid[i][j] = ( ((i + j) % 2 === 1)? this.gamePieces.WHITEMAN : null );
            }
        }

        this.state = {
            grid: usedGrid,
            playerState: {
                playerTurn: this.turn.player1, // must be generic
                playerPieces: {
                    player1: new Set().add(this.gamePieces.BLACKMAN), // must be generic
                    player2: new Set().add(this.gamePieces.WHITEMAN)
                },
                currentPiece: {
                    piecePosition: {
                        rowNum: -1,
                        colNum: -1
                    },
                    canEat: false
                    // initialized when user clicks on one of its pieces
                }
            }
        };
    }

    getBackgroundColor(heldPositionObj, i, j){
        // must be updated in chess.
        if( !this.board.isAlternatingColor )
            return this.board.baseColor
        else if( heldPositionObj.rowNum === i && heldPositionObj.colNum === j )
            return '#216c00';
        else
            return this.getAlternatingColIfNeeded(i,j)
    }

    initializeCellStyle(i,j){
        return  {
            backgroundColor: this.getBackgroundColor(this.state.playerState.currentPiece.piecePosition, i, j),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: (this.board.isCircular) ? 600 / this.board.cols : 0,
            border: 'solid',
            width: 600 / this.board.cols,
            height: 600 / this.board.cols,
        }
    }

    initializePiecesSource() {
        this.piecesSource[this.gamePieces.BLACKMAN] = <i className="fa fa-circle text-black " style={{fontSize: "50px"}}></i>;
        this.piecesSource[this.gamePieces.BLACKKING] = <i className="fa fa-circle text-black " style={{fontSize: "50px"}}></i>;
        this.piecesSource[this.gamePieces.WHITEMAN] = <i className="fa fa-circle text-white " style={{fontSize: "50px"}}></i>;
        this.piecesSource[this.gamePieces.WHITEKING] = <i className="fa fa-circle text-white " style={{fontSize: "50px"}}></i>;
    }

    constructor(props) {
        super(props);
        this.initializeGamePieces();
        this.initializePiecesRules();
        this.initializeComponentState();
        this.initializeCellStyle();
        this.initializePiecesSource();
        // this.controller = this.controller.bind(this);
        console.log('constructor ends.')
    }

    // controller.
    // selectSourceStep() {
    //
    // }
    //
    // selectDestinationStep(){
    //
    // }

    DFS(visitedGrid, currentRow, currentCol, goalRow, goalCol){
        // visited
        visitedGrid[currentRow][currentCol] = true;
        console.log(this.state.playerState.playerPieces)

        let isGoalPositionDetected = false;
        for (const [key, value] of this.pieceRule[ this.state.grid[this.state.playerState.currentPiece.piecePosition.rowNum][this.state.playerState.currentPiece.piecePosition.colNum] ].entries()){
            let destinationPointRow = currentRow + key.move[0];
            let destinationPointCol = currentCol + key.move[1];
            if (   0 > destinationPointRow || destinationPointRow >= this.board.rows
                || 0 > destinationPointCol || destinationPointCol >= this.board.cols )continue;
            else if( visitedGrid[destinationPointRow][destinationPointCol] )continue;
            else if( key.skip ){
                // exists(above), empty and opponent in middle
                if(    this.state.grid[destinationPointRow][destinationPointCol] === null
                    && ( (this.state.playerState.playerTurn === this.turn.player1)? this.state.playerState.playerPieces.player2 : this.state.playerState.playerPieces.player1 ).has( this.state.grid[(destinationPointRow + currentRow) / 2][(destinationPointCol + currentCol) / 2] ) ){

                    if( destinationPointRow === goalRow && destinationPointCol === goalCol ){
                        isGoalPositionDetected ||= true;// update
                        if( isGoalPositionDetected ){
                            this.state.grid[ (destinationPointRow + currentRow)/2 ][ (destinationPointCol + currentCol)/2 ] = null;
                        }
                    } else {
                        isGoalPositionDetected ||= this.DFS(visitedGrid, destinationPointRow, destinationPointCol, goalRow, goalCol);
                        if( isGoalPositionDetected ){
                            // remove intermediate
                            this.state.grid[ (destinationPointRow + currentRow)/2 ][ (destinationPointCol + currentCol)/2 ] = null;
                        }
                    }

                }
            }
        }
        return isGoalPositionDetected;
    }
    controller(rowIndex, colIndex){
        // >>>>>>>>>>>>>>>>>>>>> logic >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        // 2 cases. i have player who plays
        // [1] current piece = null
            // validate that is a piece of current user.
            // check if the current user can move current piece or not.  >>>>>>> extra case >>>>> if one ate in the previous turn.it only can move
            // [1] can eat using roles.
                // too easy.
            // [2] move without eat.
                // 2 cases.
                // [1] no one can eat.
                // [2] one can eat.
        // [2] current piece = (for Example) white-man
            // check if current press index one of the available for current piece.
            // a.2 base cases.
            // b. state proceed.
                // true remove captured cells of opponent.
                // false alert but no state change.

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // let rowIndex = (event.currentTarget.id / this.board.cols) >> 0;
        // let colIndex = (event.currentTarget.id % this.board.cols) >> 0;
        console.log(rowIndex)
        console.log(colIndex)

        if( this.state.playerState.currentPiece.piecePosition.rowNum === -1 ){
            // this.selectSourceStep();

            // validation part.
            console.log( 'in selection step' )
            let playerTurnObj = this.state.playerState.playerTurn;
            let playerSetObj = this.state.playerState.playerPieces;

            // console.log( playerTurnObj )
            // console.log(this.state.playerState.playerPieces)
            // console.log(this.state)
            console.log('no held piece: ' + this.state.playerState.playerPieces)

            let curPlayerTurnSet = ( (playerTurnObj === this.turn.player1)?
                                    playerSetObj.player1 : playerSetObj.player2 );
            if( !curPlayerTurnSet.has( this.state.grid[rowIndex][colIndex] ) ){
                alert('null or opponent piece access');
                return;
            }

            // check if the current user can move current piece or not part.
            let pieceEats = false;
            let humanStep = false;
            // console.log(this.state.grid[rowIndex][colIndex])
            for (const [key, value] of this.pieceRule[ this.state.grid[rowIndex][colIndex]].entries()) {
                let destinationPointRow = rowIndex + key.move[0];
                let destinationPointCol = colIndex + key.move[1];
                if( key.skip ){
                    // exists, empty and opponent in middle
                    if(    0 <= destinationPointRow && destinationPointRow < this.board.rows
                        && 0 <= destinationPointCol && destinationPointCol < this.board.cols
                        && this.state.grid[destinationPointRow][destinationPointCol] === null
                        && ( (playerTurnObj === this.turn.player1)? playerSetObj.player2 : playerSetObj.player1 ).has( this.state.grid[(destinationPointRow + rowIndex) / 2][(destinationPointCol + colIndex) / 2] ) ){
                        pieceEats = true;
                    }
                } else {
                    // console.log('humanStep is true when' + destinationPointRow + ' ' + destinationPointCol )
                    // exists and empty
                    if(    0 <= destinationPointRow && destinationPointRow < this.board.rows
                        && 0 <= destinationPointCol && destinationPointCol < this.board.cols
                        && this.state.grid[destinationPointRow][destinationPointCol] === null){
                        humanStep = true;
                    }
                }
            }

            if( pieceEats ){
                this.setState({
                    playerState: {
                        playerTurn: this.state.playerState.playerTurn,
                        playerPieces: this.state.playerState.playerPieces,
                        currentPiece: {
                            piecePosition: {
                                rowNum: rowIndex,
                                colNum: colIndex
                            },
                            canEat: true
                        }
                    }

                });
                // playerState: {
                //     currentPiece: {
                //         piecePosition: {
                //             rowNum: rowIndex,
                //             colNum: colIndex
                //         },
                //         canEat: true
                //     }
                // }

            }
            else if( humanStep ){
                // iterate on all grid cells.
                let anotherEats = false;
                for (let i = 0; i < this.board.rows; i++) {
                    for (let j = 0; j < this.board.cols; j++) {

                        // piece of grid cell belongs to cur player
                        if( curPlayerTurnSet.has(this.state.grid[i][j]) ){
                            // console.log( 'in check others if one can eat' + i + ' ' + j );
                            for (const [key, value] of this.pieceRule[ this.state.grid[i][j] ].entries()) {
                                let destinationPointRow = i + key.move[0];
                                let destinationPointCol = j + key.move[1];
                                if( key.skip ){
                                    // exists, empty and opponent in middle
                                    if(    0 <= destinationPointRow && destinationPointRow < this.board.rows
                                        && 0 <= destinationPointCol && destinationPointCol < this.board.cols
                                        && this.state.grid[destinationPointRow][destinationPointCol] === null
                                        && ( (playerTurnObj === this.turn.player1)? playerSetObj.player2 : playerSetObj.player1 ).has( this.state.grid[(destinationPointRow + i) / 2][(destinationPointCol + j) / 2] ) ){
                                        anotherEats = true;
                                    }
                                }
                            }
                        }
                    }
                }

                if( anotherEats ){
                    alert('another one can eat');
                } else {
                    this.setState({
                        playerState: {
                            playerTurn: this.state.playerState.playerTurn,
                            playerPieces: this.state.playerState.playerPieces,
                            currentPiece: {
                                piecePosition: {
                                    rowNum: rowIndex,
                                    colNum: colIndex
                                },
                                canEat: false
                            }
                        }
                    });
                    console.log("before safe move:")
                    console.log(this.state.playerState.playerPieces)
                    // console.log('no other one eat and safe move')
                    // console.log( this.state.grid )
                }
            }
            else {
                alert('all directions blocked');
            }

        }
        else {
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> select direction >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // this.selectDestinationStep();
            let heldPiece = this.state.playerState.currentPiece.piecePosition;
            if( this.state.playerState.currentPiece.canEat === false ){

                // iterate on possible moves to check if the user selected cell can move to it.
                let moveEnded = false;
                for (const [key, value] of this.pieceRule[ this.state.grid[ heldPiece.rowNum ][ heldPiece.colNum ] ].entries()) {

                    let destinationPointRow = heldPiece.rowNum + key.move[0];
                    let destinationPointCol = heldPiece.colNum + key.move[1];
                    if( destinationPointRow === rowIndex
                        && destinationPointCol === colIndex
                        && this.state.grid[ destinationPointRow ][ destinationPointCol ] === null
                        && !key.skip ){

                        moveEnded = true;
                        this.state.grid[ destinationPointRow ][ destinationPointCol ] = this.state.grid[ heldPiece.rowNum ][ heldPiece.colNum ];
                        this.state.grid[ heldPiece.rowNum ][ heldPiece.colNum ] = null;
                        let newTurn
                        if ( this.state.playerState.playerTurn === this.turn.player1 ){
                            newTurn = this.turn.player2;
                        } else {
                            newTurn = this.turn.player1;
                        }

                        this.state.playerState.playerTurn = newTurn
                        console.log(this.state.playerState.playerTurn)
                        console.log(newTurn)
                        console.log(this.state.playerState.playerPieces)
                        this.setState({
                            grid: this.state.grid,
                            playerState: {
                                // turn switch
                                playerTurn: this.state.playerState.playerTurn,
                                playerPieces: this.state.playerState.playerPieces,
                                currentPiece: {
                                    piecePosition: {
                                        rowNum: -1,
                                        colNum: -1
                                    },
                                    canEat: false
                                }
                            }
                        })
                        // console.log(this.state.playerState.playerPieces)
                        console.log(this.state.playerState.playerTurn)
                    }
                }

                if( !moveEnded ){
                    alert('select a valid destination to move to.');
                }
            }
            else {

                // visited array construction.
                const visitedGrid = Array.from(Array(this.board.rows), () => new Array(this.board.cols).fill(null));
                let validEat = this.DFS(visitedGrid, heldPiece.rowNum, heldPiece.colNum, rowIndex, colIndex);
                // remain eating
                if ( validEat ){
                    this.state.grid[ rowIndex ][ colIndex ] = this.state.grid[ heldPiece.rowNum ][ heldPiece.colNum ];
                    this.state.grid[ heldPiece.rowNum ][ heldPiece.colNum ] = null;

                    // repeated.

                    let newTurn
                    if ( this.state.playerState.playerTurn === this.turn.player1 ){
                        newTurn = this.turn.player2;
                    } else {
                        newTurn = this.turn.player1;
                    }

                    this.state.playerState.playerTurn = newTurn
                    console.log(this.state.playerState.playerTurn)
                    console.log(newTurn)
                    console.log(this.state.playerState.playerPieces)
                    this.setState({
                        grid: this.state.grid,
                        playerState: {
                            // turn switch
                            playerTurn: this.state.playerState.playerTurn,
                            playerPieces: this.state.playerState.playerPieces,
                            currentPiece: {
                                piecePosition: {
                                    rowNum: -1,
                                    colNum: -1
                                },
                                canEat: false
                            }
                        }
                    })
                    // console.log(this.state.playerState.playerPieces)
                    console.log(this.state.playerState.playerTurn)

                    // end repeated.

                } else {
                    alert('not a valid destination.');
                }
            }
        }

    }

    // itemRender(rowIndex, colIndex) {
    //     const pieceEnum = this.state.grid[rowIndex][colIndex]; // enum
    //     const heldPositionObj = this.state.playerState.currentPiece.piecePosition;
    //     if( pieceEnum === null )
    //         return '';
    //     else if( heldPositionObj.rowNum === rowIndex && heldPositionObj.colNum === colIndex ){
    //         return <i className='fa fa-circle text-info' style={{ fontSize: "50px", borderColor: "red" }}></i>
    //     } else
    //         return this.piecesSource[pieceEnum];
    // }
    drawer(){
        return super.drawer();
    }

    render() {
        return this.drawer();
    }

}

export default Checkers;







