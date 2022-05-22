import './Main.css';
import React from "react";
import {Link} from "react-router-dom";

function Main() {
return (
        <div className="Main">
        
            <div className="buttonGroup">
            <Link to="/login"> 
                <button className="styled" type="button">
                    LOG IN
                </button>
            </Link>
            <Link to="/signup">
                <button className="styled" type="button">
                    SIGN UP
                </button>
            </Link>
            </div>
        
        </div>
);
}

export default Main;
