import React from "react";
import './Button.css';
 
export default function Button({name, onClick, variant, color='white'}){
    return(
        <>
            <button
                className={`btn-${variant}`}
                style={{ '--btn-color': color }}
                onClick={onClick}
            >
                {name}
            </button>
        </>


    )

}