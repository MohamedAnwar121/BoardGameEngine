class SudokuGenerator {

    constructor(N, K) {
        this.N = N;
        this.K = K;
        this.SRN = Math.floor(Math.sqrt(N));
        this.mat = new Array(N).fill(0).map(() => new Array(N).fill(0));
    }

    fillValues() {
        this.fillDiagonal();
        this.fillRemaining(0, this.SRN);
        this.removeKDigits();
    }

    fillDiagonal() {
        for (let i = 0; i < this.N; i += this.SRN) this.fillBox(i, i);
    }

    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    fillBox(row, col) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                let num;
                do {
                    num = this.randomGenerator(this.N);
                } while (!this.unUsedInBox(row, col, num));

                this.mat[row + i][col + j] = num;
            }
        }
    }

    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }

    checkIfSafe(i, j, num) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
        );
    }

    unUsedInRow(i, num) {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    unUsedInCol(j, num) {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    fillRemaining(i, j) {
        if (j >= this.N && i < this.N - 1) {
            i = i + 1;
            j = 0;
        }

        if (i >= this.N && j >= this.N) {
            return true;
        }

        if (i < this.SRN) {
            if (j < this.SRN) {
                j = this.SRN;
            }
        } else if (i < this.N - this.SRN) {
            if (j === Math.floor(i / this.SRN) * this.SRN) {
                j = j + this.SRN;
            }
        } else {
            if (j === this.N - this.SRN) {
                i = i + 1;
                j = 0;
                if (i >= this.N) {
                    return true;
                }
            }
        }

        for (let num = 1; num <= this.N; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }

                this.mat[i][j] = 0;
            }
        }
        return false;
    }

    removeKDigits() {
        let count = this.K;
        while (count !== 0) {
            let cellId = this.randomGenerator(this.N * this.N) - 1;

            let i = Math.floor(cellId / this.N);
            let j = cellId % this.N;
            if (j !== 0) {
                j = j - 1;
            }

            if (this.mat[i][j] !== 0) {
                count--;
                this.mat[i][j] = 0;
            }
        }
    }

    generateSudoku(){
        this.fillValues();
        return this.mat;
    }
}

export default SudokuGenerator;
