import {useEffect, useRef} from 'react';

export function useOnDraw(onDraw){
    const canvasRef = useRef(null);
    const prevPointRef = useRef(null);
    const isDrawingRef = useRef(false);
    const historyRef = useRef([]);
    const currentStepRef = useRef(-1);

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    useEffect(() =>{

        function initMouseMoveListener(){
            const mouseMoveListener = (e) => {  //whenever the mouse is moved the event is called
                if(isDrawingRef.current){
                    const point = computePointInCanvas(e.clientX  ,e.clientY); //inside the llistner we 1st get the the point valuse thet is relative to the top left corner od the canvas
                    const ctx  = canvasRef.current.getContext('2d');
                    if(onDraw) onDraw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;
                    console.log(point);
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }
    
        function initMouseUpListener(){
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
                const ctx = canvasRef.current.getContext('2d');
                saveToHistory(ctx.canvas.toDataURL());
            }
            mouseUpListenerRef.current = listener;
            window.addEventListener("mouseup",listener);
        }
    
        function computePointInCanvas(clientX , clientY){
            if(canvasRef.current){
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return{
                    x : clientX - boundingRect.left , 
                    y : clientY - boundingRect.top
                }
            }
            else{
                return null;
            }
            
        }

        function removeListeners(){
            if(mouseMoveListenerRef.current){
                window.removeEventListener("mousemove",mouseMoveListenerRef.current);
            }
            if(mouseUpListenerRef.current){
                window.removeEventListener("mouseup",mouseUpListenerRef.current);
            }
        }
        initMouseMoveListener();
        initMouseUpListener();


        return()=>{
            //TODO: clean up!
            removeListeners();
        }
    },[onDraw]);

    function setCanvasRef(ref){    
        canvasRef.current = ref;
    }

    function onMouseDown(){
        isDrawingRef.current = true;
    }

    function saveToHistory(imageData) {
        if (currentStepRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, currentStepRef.current + 1);
        }
        historyRef.current.push(imageData);
        currentStepRef.current++;
        console.log('Saved to history:', imageData); // Log saved image data for verification
    }

    function undo() {
        if (currentStepRef.current > 0) {
            currentStepRef.current--;
            replayHistory();
        }
    }
    
    function redo() {
        if (currentStepRef.current < historyRef.current.length - 1) {
            currentStepRef.current++;
            replayHistory();
        }
    }
    
    function replayHistory() {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const image = new Image();
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
        image.src = historyRef.current[currentStepRef.current];
    }
    

    function clearCanvas() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        historyRef.current = [];
        currentStepRef.current = -1;
    }

    return{
        setCanvasRef,
        onMouseDown,
        undo,
        redo,
        clearCanvas,
        replayHistory,
        historyRef
    };
};
    