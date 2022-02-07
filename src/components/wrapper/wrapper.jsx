import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import WebCam from "react-webcam";
import styles from './wrapper.scss';

const PREDICTION_STATES = {
    "RUNNING": 1,
    "STOP": 0,
};

let predictionInterval;
let cocoModel;

const Wrapper = () => {

    const [predictionState, setPredictionState] = useState(PREDICTION_STATES.STOP);
    const videoWidth = 1920;
    const videoHeight = 1080;
    const webcamRef = useRef(null);

    const videoConstraints = {
        height: 1080,
        width: 1920,
    };

    const loadModel = async () => {
        try {
            cocoModel = await cocoSsd.load();
            console.log("set Loaded Model");
        } catch (err) {
            console.error(err);
            console.error("Failed load model");
        }
    };

    const predictionFunction = async() => {
        const myCanvas = document.getElementById("canvas");
        const canvasContext = myCanvas.getContext("2d");
        canvasContext.font = "28px Arial";
        canvasContext.fillStyle = "red";
        canvasContext.strokeStyle = "#FF0000";
        canvasContext.lineWidth = 3;

        if(predictionState === PREDICTION_STATES.STOP) {
            startPrediction(canvasContext);
        } else {
            stopPrediction(canvasContext);
        }
    };

    const startPrediction = (canvasContext) => {
        predictionInterval = setInterval(async () => {
            const predictions = await cocoModel.detect(document.getElementById("webcamImg"));
            canvasContext.clearRect(0,0, webcamRef.current.video.videoWidth,webcamRef.current.video.videoHeight);
    
            if(predictions.length > 0) {
                predictions.map((prediction) => {
                    const bboxLeft = prediction.bbox[0];
                    const bboxTop = prediction.bbox[1];
                    const bboxWidth = prediction.bbox[2];
                    const bboxHeight = prediction.bbox[3];
                    const predictionText = `${prediction.class}: ${Math.round(parseFloat(prediction.score) * 100)}%`;

                    canvasContext.beginPath();
                    canvasContext.fillText(
                        predictionText,
                        bboxLeft,
                        bboxTop - 10
                    );

                    canvasContext.rect(bboxLeft, bboxTop, bboxWidth, bboxHeight);
                    canvasContext.stroke();
                });
            }
        }, 100);
        setPredictionState(PREDICTION_STATES.RUNNING);
    };

    const stopPrediction = (canvasContext) => {
        clearInterval(predictionInterval);
        setPredictionState(PREDICTION_STATES.STOP);
        canvasContext.clearRect(0,0, webcamRef.current.video.videoWidth,webcamRef.current.video.videoHeight);
    };


    useEffect(() => {
        tf.ready().then(() => {
            loadModel();
        });
    }, []);

    return (
        <>
            <button className={styles.togglePrediction}
                onClick={() => { predictionFunction(); } }>
                {predictionState === PREDICTION_STATES.RUNNING ? 'Stop Prediction' : 'Start Prediction'}
            </button>
            <div className={styles.webcam}>
                <WebCam 
                    audio={false}
                    id="webcamImg"
                    ref={webcamRef}
                    screenshotQuality={1}
                    screenshotFormat="image/jpeg" 
                    videoConstraints={videoConstraints}/>
            </div>
            <div className={styles.canvas}> 
                <canvas id="canvas"
                        width={videoWidth}
                        height={videoHeight}/>
            </div>
        </>
    )
};

export default Wrapper;