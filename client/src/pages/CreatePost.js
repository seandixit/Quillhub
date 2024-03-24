import React from "react";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { SketchPicker } from 'react-color';
import { Slider } from '@mui/material';

export default function CreatePost() {
    const titleCanvasDrawRef = React.useRef();
    const mainCanvasDrawRef = React.useRef();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushRadius, setBrushRadius] = useState(2);
    const [backgroundColor, setBackgroundColor] = useState('#F8FAE5');
    const [canvasHeight, setCanvasHeight] = useState(1000);

    async function createNewPost(ev) {
        const titleCanvasData = titleCanvasDrawRef.current.canvasContainer.childNodes[1].toDataURL();
        const mainCanvasData = mainCanvasDrawRef.current.canvasContainer.childNodes[1].toDataURL();

        const currentDate = new Date();

        // UTC date and time
        const utcYear = currentDate.getUTCFullYear();
        const utcMonth = currentDate.getUTCMonth() + 1; // Adding 1 because January is 0
        const utcDayOfMonth = currentDate.getUTCDate();
        const utcHours = currentDate.getUTCHours();
        const utcMinutes = currentDate.getUTCMinutes();
        const utcSeconds = currentDate.getUTCSeconds();

        // Formatting UTC date and time
        const formattedUtcMonth = utcMonth < 10 ? '0' + utcMonth : utcMonth;
        const formattedUtcDayOfMonth = utcDayOfMonth < 10 ? '0' + utcDayOfMonth : utcDayOfMonth;

        // Convert UTC hours to 12-hour format
        const formattedUtcHours = (utcHours % 12) || 12;

        const ampm = utcHours >= 12 ? 'PM' : 'AM';
        const dateString = `${formattedUtcMonth}-${formattedUtcDayOfMonth}-${utcYear} ${formattedUtcHours}:${utcMinutes < 10 ? '0' : ''}${utcMinutes}:${utcSeconds < 10 ? '0' : ''}${utcSeconds} ${ampm} (UTC)`;


        const data = new FormData();
        //data.set('title', title);
        //data.set('summary', "123")
        //data.set('content', content)
        //data.set('file', files[0])
        data.set('titleCanvasData', titleCanvasData);
        data.set('mainCanvasData', mainCanvasData);
        data.set('date', dateString);
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            setRedirect(true);
        }
    }

    if (redirect){
        return <Navigate to={'/'}/>
    }

    async function handleUndoMain(ev){
        
        mainCanvasDrawRef.current.undo();
    };

    async function handleUndoTitle(ev){
        
        titleCanvasDrawRef.current.undo();
    };

    const handleRadiusChange = (event, newValue) => {
        setBrushRadius(newValue);
    }

    const changeBackgroundColor = (event, newValue) => {
        setBackgroundColor(newValue);
    }

    const addCanvasPage = (event, newValue) => {
        setCanvasHeight(canvasHeight + 1000);
    }

        return (
        <div classname="post-container">
            <form onSubmit={createNewPost} className="postForm">
                <div className="both-container">
                <div className="canvas-container"> 
                    <div className="canvasTitle">
                        <CanvasDraw
                            ref={titleCanvasDrawRef}
                            className="title"
                            loadTimeOffset={0}
                            lazyRadius={0}
                            brushRadius={brushRadius}
                            brushColor={brushColor}
                            catenaryColor={"#0a0302"}
                            gridColor={"#000"}
                            hideGrid={false}
                            canvasWidth={800}
                            canvasHeight={80}
                            disabled={false}
                            imgSrc={""}
                            saveData={null}
                            immediateLoading={false}
                            hideInterface={true}
                            gridSizeX={35}
                            gridSizeY={35}
                            gridLineWidth={0.5}
                            hideGridX={true}
                            hideGridY={true}
                            enablePanAndZoom={false}
                            mouseZoomFactor={0.01}
                            onChange={null}
                            backgroundColor={backgroundColor}
                        />
                    </div>
                    <div className="canvas">
                        <CanvasDraw
                            ref={mainCanvasDrawRef}
                            className="mainCanvas"
                            loadTimeOffset={0}
                            lazyRadius={0}
                            brushRadius={brushRadius}
                            brushColor={brushColor}
                            catenaryColor={"#000"}
                            gridColor={"#000"}
                            hideGrid={false}
                            canvasWidth={800}
                            canvasHeight={canvasHeight}
                            disabled={false}
                            imgSrc={""}
                            saveData={null}
                            immediateLoading={false}
                            hideInterface={true}
                            gridSizeX={35}
                            gridSizeY={30}
                            gridLineWidth={0.5}
                            hideGridX={true}
                            hideGridY={false}
                            enablePanAndZoom={false}
                            mouseZoomFactor={0.01}
                            onChange={null}
                            backgroundColor={backgroundColor}
                        />
                    </div>
                </div>
                <div className='controls-container'>
                <div>
    <label htmlFor="brushColorPicker">Brush Color:</label>
    <SketchPicker id="brushColorPicker" color={brushColor} onChangeComplete={color => setBrushColor(color.hex)} />
</div>
<button type="button" className="undoTitleButton" onClick={() => {handleUndoTitle()}}>Undo Title</button>
<button type="button" className="undoMainButton" onClick={() => {handleUndoMain()}}>Undo Main</button>
<div>
    <label htmlFor="brushRadiusSlider">Brush Radius:</label>
    <Slider
        id="brushRadiusSlider"
        defaultValue={2}
        aria-label="Radius"
        value={brushRadius}
        onChange={handleRadiusChange}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={20}
    />
</div>
<div>
    <label htmlFor="backgroundColorPicker">Paper Color:</label>
    <SketchPicker id="backgroundColorPicker" color={backgroundColor} onChangeComplete={color => setBackgroundColor(color.hex)} />
</div>
<button type="button" className="addPageButton" onClick={() => addCanvasPage()}>Add Page</button>
                </div>
                </div>
                <button className="canvasButton">Create</button>
            </form>
            
        </div>
    )
}

// NAVBAR will contain: color picker, radius picker, background-color changer, lines changer (have 4 options (w/ images): none (hidegrid), short, med, long), gridy show, add page button (extends page)
// take screenshot instead
// have undo button

