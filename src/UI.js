import React from 'react';
import Choices from "./Interface/Choices";

const Ui = () => {
    return (
        <div className="container">

            <div className="row" >
                <div className="col d-flex and justify-content-center">
                    <button className="btn btn-info fs-3 disabled" style={{  width: "50%" }}>
                        Board Games <i className="fa fa-chess-board"></i>
                    </button>
                </div>
            </div>
            <div className="row">
                <Choices />
            </div>
        </div>
    );
};

export default Ui;
