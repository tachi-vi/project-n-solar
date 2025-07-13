import React, { Children } from "react";
import './Section.css';

export default function Section({children, name, style}){
    return(
        <>
        <section style={style}>
        <div className="sectiontitle">        
            <hr/>
            <h1 className="title">{name}</h1>
            <hr/>
        </div>
              <div className="gridcontainer">
                  {children}
              </div>
        </section>
        </> 
    )

}