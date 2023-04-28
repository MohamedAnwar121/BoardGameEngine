import React from 'react';
import {Link} from "react-router-dom";

const Choices = () => {

    const listOfGames = [
        {id: 1, gameName: 'Tic-Tac-Toe'},
        {id: 2, gameName: 'Connect-4'},
        {id: 3, gameName: 'Checkers'},
        {id: 4, gameName: 'Chess'},
        {id: 5, gameName: 'Sudoku'},
        {id: 6, gameName: '8-Queens'}];
    const listItems = listOfGames.map(game =>
        <div className="row m-5">
            <button
                className="btn fs-1 bg-black rounded-5"
                key={ game.id }
                style={{width: "20%", marginLeft: game.id * 100}}>
                <Link className="text-white text-decoration-none bg-black" to={`/${game.gameName}`}>{ game.gameName }</Link>
            </button>
        </div>
    );

    return ( <div className="col"> {listItems} </div>  );
};

export default Choices;
