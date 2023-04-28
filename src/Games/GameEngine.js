import {Component} from 'react';
import {Col, Row} from "react-bootstrap";
import {keyboard} from "@testing-library/user-event/dist/keyboard";


class GameEngine extends Component {

    singlePlayer = false;
    turn = {
        player1: 'player1',
        player2: 'player2'
    };

    board = {
        rows: 0,
        cols: 0,
    }

    cell = {
        height: 0,
        width: 0,
        default_color: null,
        alternating_color: null,
        shape: null,
        piece: null
    }

    piece = {
        name: '',
        source: null,
        id: null
    }
    cellStyle = null;

    controller() {}

    instantiateBoard(rows, cols) {
        this.board.rows = rows;
        this.board.cols = cols;
        return Array.from(Array(rows), () => new Array(cols).fill(null));
    }

    drawer() {

        let data = this.state.grid;
        const listItems = [];

        data.forEach((row, rowIndex) => {
            const rowItems = [];
            row.forEach((item, colIndex) => {
                rowItems.push(<li key={`${rowIndex}-${colIndex}`}>{item}, {rowIndex}, {colIndex}</li>);
            });
            listItems.push(<ul key={rowIndex}>{rowItems}</ul>);
        });

        return (
            <div>
                {listItems}
            </div>
            // <div className="grid-container rounded-5">
            //     {data.map((row, rowIndex) => (
            //         <div key={rowIndex} className="grid-row">
            //             <Row className="d-block">
            //             {row.map((cell, cellIndex) => (
            //               <Col key={rowIndex * this.board.cols + cellIndex}>
            //                 <button key={cellIndex * (this.board.rows-1) + rowIndex} style={ this.cellStyle }>{cell} {rowIndex}, {cellIndex}, {cellIndex * (this.board.rows-1) + rowIndex} </button>
            //               </Col>
            //             ))}
            //             </Row>
            //         </div>
            //     ))}
            // </div>
        )
    }

    render() {
        return this.drawer();
    }

}

export default GameEngine;
