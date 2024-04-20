import {useOnDraw} from './Hooks';
import { useState } from 'react';

const Canvas = ({
    width,
    height
}) =>{
    const [color, setColor] = useState('#000000'); // Default color is black
    const [thickness, setThickness] = useState(5); // Default thickness is 5


    const {
        onMouseDown,
        setCanvasRef,
        undo,
        redo,
        clearCanvas,
        replayHistory,
        historyRef,
    } = useOnDraw(onDraw);

    function onDraw(ctx,point,prevPoint){
        drawLine(prevPoint ,point, ctx, color , thickness);
    }

    function drawLine(
        start,
        end,
        ctx,
        color,
        thickness
    ){
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x,end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x , start.y , thickness/2 , 0 , 2*Math.PI);
        ctx.fill();

    }
/*
    function clearCanvas() {
        const canvas = document.querySelector('.canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
*/

    // Verify if historyRef is being received correctly
    console.log('historyRef:', historyRef);

    // Verify if undo, redo, and clearCanvas functions are being called correctly
    const handleUndo = () => {
        console.log('Undo button clicked');
        undo();
        replayHistory(); // Redraw canvas after undo
    };

    const handleRedo = () => {
        console.log('Redo button clicked');
        redo();
        replayHistory(); // Redraw canvas after undo
    };



    function saveDrawing() {
        const canvas = document.querySelector('canvas');
        const jsonData = JSON.stringify(historyRef.current);
        localStorage.setItem('drawingHistory', jsonData);

        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = image;
        link.click();
    }
    
    /*
    //to save the drawing
    function saveDrawing() {
        const canvas = document.querySelector('canvas');
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = image;
        link.click();
    }
    */
    return (
        <div className="canvas-container">
            <canvas
                className='board canvas'
                width={width}
                height={height}
                onMouseDown={onMouseDown}
                style={canvasStyle}
                ref={setCanvasRef}
            />
            <div className='controls'>
                <div className='color'>
                <label htmlFor="colorPicker">Color:</label>
                <input
                    type="color"
                    id="colorPicker"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                </div>
                <div className='thick'>
                <label htmlFor="thicknessSlider">Thickness:</label>
                <input
                    type="range"
                    id="thicknessSlider"
                    min="1"
                    max="20"
                    value={thickness}
                    onChange={(e) => setThickness(parseInt(e.target.value))}
                />
                </div>
            </div>
            
            <div>
                <button className="undo-button" onClick={handleUndo}>Undo</button>
                <button className="redo-button" onClick={handleRedo}>Redo</button>
                <button className="clear-button" onClick={clearCanvas}>Clear All</button>
            </div>
            <div></div>
            <button className="save-button" onClick={saveDrawing}>Save Drawing</button>
        </div>
    );
    /*
    return(
        <canvas
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            style = {canvasStyle}
            ref = {setCanvasRef}
        />
    );
    */
}

export default Canvas;

const canvasStyle= {
    border: "1px solid black"
}