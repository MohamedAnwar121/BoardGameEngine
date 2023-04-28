import GameEngine from "./GameEngine";

class Sudoku extends GameEngine{

    constructor(props) {
        super(props);
        this.singlePlayer = true;
    }

    controller(){

    }

    drawer(){

    }

    render() {
        return this.drawer();
    }

}

export default Sudoku;
