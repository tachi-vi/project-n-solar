import React from "react";
import './card.css';

export default function Card({title, description, bgColor, borderColor, boxShadowColor}){
    return (
        <>
            <div className="card"                 
                 style={{ 
                    "--card-bg-color": bgColor, 
                    "--card-border-color": borderColor, 
                    "--card-bshadow-color": boxShadowColor 
                }}>

                <h3>{title}</h3>
                <p>{description}</p>

            </div>
        
        </>


    )

}