import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import { useState } from "react";
import { Navigate } from "react-router-dom";
//import TimeAgo from 'timeago-react';
//<TimeAgo datetime={date} />

export default function Post({titleCanvasData, mainCanvasData, ocrTitleText, ocrMainText, date, author}){
  
  //<img src="https://i.imgur.com/fxUDh3X.jpg" alt=""/>
    return (
    <div className="post">
        <div className="image">
          <img src={titleCanvasData} alt="" className="title-image"/>
          <img src={mainCanvasData} alt="" className="main-image"/>
        </div>
        <div className="texts">
          <h2>{ocrTitleText}</h2>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{date}</time> 
          </p> 
          <p className="summary">{ocrMainText}</p>
        </div>
      </div>
    )
}