
'use strict';

let myVideoInputs = [];
let playerWidth = 0;
let playerHeight = 0;
let haveDeviceInfo = false;
let someCamerasHaveBeenStarted = false;

/******************************************************************************************************
*******************************************************************************************************
* function definitions
*******************************************************************************************************
******************************************************************************************************/
const getDevicesInfo = async () => {
    await navigator.mediaDevices.enumerateDevices()
        .then(results => {
            //console.log(results);
            results.forEach(result => {
                if (result.kind === 'videoinput') {
                    //console.log(result);
                    myVideoInputs.push(result);
                }
            })
            haveDeviceInfo = true;
        })
        .catch(error => {
            console.log(error);
            haveDeviceInfo = false;
        });
}

// connects camera video stream to a vido player on html page
const startCamera = (myVideoInput, whichPlayer) => {
    if (myVideoInput === undefined) { console.log('myVideoInput is undefined'); return; }
        navigator.mediaDevices.getUserMedia( { 
            video: { 
                width: playerWidth, 
                height: playerHeight,
                deviceId: myVideoInput.deviceId,
            }
        })
        .then(stream => {
            whichPlayer.srcObject = stream;
        })
        .catch(error => {
            console.log(error);
        });
}

const cleanUp = (whichCamera) => {
    try {
        const stream = whichCamera.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    } catch (error) {
        if (someCamerasHaveBeenStarted !== false) console.log(error);


    }
}

const stopAllCameras = () => {
    cleanUp(player1);
    cleanUp(player2);
    cleanUp(player3);
    haveDeviceInfo = false;
    someCamerasHaveBeenStarted = false;
}

const startAllCameras = async () => {
    stopAllCameras();
    await getDevicesInfo()
        .then(() => {
            //startCamera(myVideoInputs[0], player1); // not going to use main laptop camera for this app
            startCamera(myVideoInputs[1], player2);
            startCamera(myVideoInputs[2], player3);
            someCamerasHaveBeenStarted = true;
        });
}

//this places image from video player into canvas AND
// can return the image (for manipulation?)
// using the returned image is not required. 
// (example - when saving to file, we first call this func, then
// separately do a canvas-to-blob -> to save)
const captureCameraImage = (camera, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const putImageOnCanvas = (image, canvas) => {
    canvas.getContext('2d').putImageData(image, 0, 0);
}

const createDifference = (image1, image2) => {
    const data1 = image1.data;
    const data2 = image2.data;
    if (data1.length !== data2.length) {
        throw 'createDifference: Image1 and Image2 lengths do Not match';
    }
    if (image1.width !== image2.width) {
        throw 'createDifference: Image1 and Image2 widths do Not match';
    }
    if (image1.height !== image2.height) {
        throw 'createDifference: Image1 and Image2 heights do Not match';
    }
    let newData = [];
    for (let i=0; i<data1.length; i+=4) {
        newData[i] = 255 - Math.abs(data1[i] - data2[i]);
        newData[i+1] = 255 - Math.abs(data1[i+1] - data2[i+1]);
        newData[i+2] = 255 - Math.abs(data1[i+2] - data2[i+2]);
        newData[i+3] = 255;
    }

    return new ImageData(new Uint8ClampedArray(newData), image1.width, image1.height);
}

const modification = (data, parms) => {
    if (parms.contrast === undefined) { 
        throw 'highlightSelfDifference: missing param : contrast';
    }
    let contrast = parms.contrast;

    if (parms.typeOfDiff === undefined) { 
        throw 'highlightSelfDifference: missing param : typeOfDiff';
    }
    let typeOfDiff = parms.typeOfDiff;

    if (parms.threshold === undefined) { 
        throw 'highlightSelfDifference: missing param : threshold';
    }
    let threshold = parms.threshold;

    let newData = [];
    for (let i=0; i<data.length; i+=4) {

        if (contrast > 0 && typeOfDiff  === 'color') {
            newData[i] = data[i] > 128 ? data[i] + contrast : data[i] - contrast;
            newData[i] = newData[i] > 255? 255 : newData[i];
            newData[i] = newData[i] < 0? 0 : newData[i];
            newData[i+1] = data[i+1] > 128 ? data[i+1] + contrast : data[i+1] - contrast;
            newData[i+1] = newData[i+1] > 255? 255 : newData[i+1];
            newData[i+1] = newData[i+1] < 0? 0 : newData[i+1];
            newData[i+2] = data[i+2] > 128 ? data[i+2] + contrast : data[i+2] - contrast;
            newData[i+2] = newData[i+2] > 255? 255 : newData[i+2];
            newData[i+2] = newData[i+2] < 0? 0 : newData[i+2];
        }

        if (contrast > 0 && typeOfDiff  === 'mono') {
            let min = Math.min(data[i], data[i+1], data[i+2]);
            newData[i] = data[i] > 128 ? data[i] + contrast : data[i] - contrast;
            newData[i] = newData[i] > 255? 255 : newData[i];
            newData[i] = newData[i] < 0? 0 : newData[i];
            newData[i+1] = newData[i];
            newData[i+2] = newData[i];
        }


        //this means we see only red or white.. no inbetween, no other colors
        //red is the diff (the image), white is the background
        if (typeOfDiff === 'solid') {

            let min = Math.min(data[i], data[i+1], data[i+2]);

            newData[i] = 255;   //leave Red at max
            if (min < threshold) {
                newData[i+1] = 255 - threshold;
                newData[i+2] = 255 - threshold;
            } else {
                newData[i+1] = 255;
                newData[i+2] = 255;
            }
        }


        newData[i+3] = 255; //leave alpha at max
    }
    return newData;
}


const mixTwoImagesOntoCanvas = (image1, image2, canvas, mixFunc) => {
    let mixedImage = mixFunc(image1, image2);
    canvas.getContext('2d').putImageData(mixedImage, 0, 0);
}

const modifyImageOnCanvas = (canvas, parms) => {
    let ctx = canvas.getContext('2d');
    let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = image.data;
    let newData = modification(data, parms);
    let newImage = new ImageData(new Uint8ClampedArray(newData), image.width, image.height);
    ctx.putImageData(newImage, 0, 0);
}

/******************************************************************************************************
 * execution
 *****************************************************************************************************/
stopAllCameras();