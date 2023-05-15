import React from 'react';
import {Link} from "react-router-dom";
import chessImg from './chess.png';
import checkersImg from './checkers.png';
import XOImg from './xo.png';
import sudokuImg from './suduko.png';
import connectFourImg from './connectFour.png';
import eightQueens from './eightQueens.png';


const Choices = () => {

    const xoImgLink = "url('https://yt3.ggpht.com/a/AATXAJwDgIo5dB5llYVBCOF5A5jvC4splFhbY3zjsw=s900-c-k-c0xffffffff-no-rj-mo')";
    const chessImgLink = "url('https://tse1.mm.bing.net/th?id=OIP.EGpAdLxTQ8GodFbRizobAwHaF7&pid=Api&P=0')"
    const checkersImgLink = "url('https://wallpapercave.com/wp/wp4699894.jpg')"
    // const checkersImgLink = "url('')"

    const listOfGames = [
        {id: 1, gameName: 'Tic-Tac-Toe', url: `url(${XOImg})`},
        {id: 2, gameName: 'Connect-4', url: `url(${connectFourImg})`},
        {id: 3, gameName: 'Checkers', url: `url(${checkersImg})`},
        {id: 4, gameName: 'Chess', url: `url(${chessImg})`},
        {id: 5, gameName: 'Sudoku', url: `url(${sudokuImg})`},
        {id: 6, gameName: '8-Queens', url: `url(${eightQueens})`}];

    function styleObjFun(id) {
        return {
            width: "260px",
            height: "270px",
            marginLeft: 100,
            marginTop: 100,
            backgroundImage: listOfGames[id-1].url,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        };
    }
    const labelStyle = {
        marginLeft: '115px',
        fontSize: '38px',
        marginBottom: '-80px',
        justifyContent: 'center',
        alignItems: 'center',
        alignment: 'center',
    }
    const listItems = listOfGames.map(game =>
        <div className="col-3 m-4">

            <Link className="text-white text-decoration-none" to={`/${game.gameName}`}>
                <div className="row" style={labelStyle}>
                    {game.gameName}
                </div>
                <div className="row">
                    <button
                        className="btn fs-1  btn-bg-image"
                        key={ game.id }
                        style= { styleObjFun(game.id) }>

                    </button>
                </div>
            </Link>

        </div>
    );

    return ( <div className="row"> {listItems} </div>  );
};

export default Choices;
