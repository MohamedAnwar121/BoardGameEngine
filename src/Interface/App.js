import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import TicTacToe from "../Games/TicTacToe";
import ConnectFour from "../Games/ConnectFour";
import Checkers from "../Games/Checkers";
import Chess from "../Games/Chess";
import Sudoku from "../Games/Sudoku";
import EightQueens from "../Games/EightQueens";
import 'bootstrap/dist/css/bootstrap.min.css';
import UI from "../UI";

function App() {

    function changeImage(location) {

        switch (location.pathname){
            case '/': return "url('https://wallpaperaccess.com/full/1642289.jpg')";
            case '/Checkers': return "url('https://www.hdwallpaper.nu/wp-content/uploads/2017/03/circle-23.png')";
            case '/Chess' : return "url('https://static.vecteezy.com/system/resources/previews/000/697/543/original/chess-rook-wire-frame-polygon-blue-frame-structure-vector.jpg')";
            case '/Connect-4': return "url('https://wallpapercave.com/wp/wp4699894.jpg')";
            case '/Sudoku': return "url('https://wallpapercave.com/wp/wp4699894.jpg')";
            case '/8-Queens': return "url('https://wallpapercave.com/wp/wp4699894.jpg')";
            case '/Tic-Tac-Toe': return "url('https://wallpapercave.com/wp/wp4699894.jpg')";
        }

    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <UI />
                        </div>
                    )}
                </Route>
                <Route exact path="/Tic-Tac-Toe">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <TicTacToe />
                        </div>
                    )}
                </Route>
                <Route exact path="/Connect-4">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <ConnectFour />
                        </div>
                    )}
                </Route>
                <Route exact path="/Checkers">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <Checkers />
                        </div>
                    )}
                </Route>
                <Route exact path="/Chess">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <Chess />
                        </div>
                    )}
                </Route>
                <Route exact path="/Sudoku">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <Sudoku />
                        </div>
                    )}
                </Route>
                <Route exact path="/8-Queens">
                    {({ location }) => (
                        <div
                            className="App"
                            style={{
                                width: "100%",
                                backgroundImage: changeImage(location),
                                height: "100vh",
                                backgroundSize: 'cover'
                            }}
                        >
                            <EightQueens />
                        </div>
                    )}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
