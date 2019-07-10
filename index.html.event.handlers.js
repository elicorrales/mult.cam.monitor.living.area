'use strict';

let pressedPlayAtLeastOnceAfterStartOfStreaming = false;
let snapAllPhotosContinuous = false;
let sendCurrentGalleryToMixed = false;
let sendCurrentBackgroundsToMixed = false;

let photoWidth = 0;
let photoHeight = 0;
let photoDispWidth = 0;
let photoDispHeight = 0;

const rightCanvasPos = {x:0, y:0}

let typeOfDiff = 'mono';

/******************************************************************************************************
*******************************************************************************************************
* function definitions
*******************************************************************************************************
******************************************************************************************************/
const doChangePlayerWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        showMessages('warning','All Camera Feeds Stopping..');
        stopAllCameras();
        startStopAllCameras.innerHTML = 'Stream All';
        startStopAllCameras.className = 'btn btn-default';
        pauseAllPlayers();
        playPauseAllPlayers.disabled = true;
        hideAllPlayers();
        playerWidth = document.getElementById('playerWidth').value;
        playerHeight = document.getElementById('playerHeight').value;
        pressedPlayAtLeastOnceAfterStartOfStreaming = false;
    }
}

const doChangePlayerHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        showMessages('warning','All Camera Feeds Stopping..');
        stopAllCameras();
        startStopAllCameras.innerHTML = 'Stream All';
        startStopAllCameras.className = 'btn btn-default';
        pauseAllPlayers();
        playPauseAllPlayers.disabled = true;
        hideAllPlayers();
        playerWidth = document.getElementById('playerWidth').value;
        playerHeight = document.getElementById('playerHeight').value;
        pressedPlayAtLeastOnceAfterStartOfStreaming = false;
    }
}

const doStartStopAllCameras = (button) => {
    try {
        if (button.innerHTML === 'Stream All') {
            startAllCameras();
            showMessages('info','Camera Feeds Starting....');
            button.innerHTML = 'Stop All';
            button.className = 'btn btn-primary';
            playPauseAllPlayers.disabled = false;
            //photoCanvas1.style.display = 'inline';
            photoCanvas2.style.display = 'inline';
            photoCanvas3.style.display = 'inline';
            //photoDispCanvas1.style.display = 'inline';
            photoDispCanvas2.style.display = 'inline';
            photoDispCanvas3.style.display = 'inline';
            //galleryDispCanvas1.style.display = 'inline';
            galleryDispCanvas2.style.display = 'inline';
            galleryDispCanvas3.style.display = 'inline';
            //backgroundsDispCanvas1.style.display = 'inline';
            backgroundsDispCanvas2.style.display = 'inline';
            backgroundsDispCanvas3.style.display = 'inline';
            //backgroundsPlusGalleriesDispCanvas1.style.display = 'inline';//main laptop camera-related stuff not used in this app
            backgroundsPlusGalleriesDispCanvas2.style.display = 'inline';
            backgroundsPlusGalleriesDispCanvas3.style.display = 'inline';
        } else {
            stopAllCameras();
            showMessages('info','Camera Feeds Stopping....');
            button.innerHTML = 'Stream All';
            button.className = 'btn btn-default';
            pauseAllPlayers();
            playPauseAllPlayers.disabled = true;
            hideAllPlayers();
        }
    } catch (error) {
        showMessages('danger',error);
    }
    pressedPlayAtLeastOnceAfterStartOfStreaming = false;
}

const doStopCamera = (button) => {
    const id = button.id;
    switch (id) {
        case 'stopPlayer1':
                player1.controls = false;
                player1.hidden = true;
                photoCanvas1.style.display = 'none';
                photoDispCanvas1.style.display = 'none';
                galleryDispCanvas1.style.display = 'none';
                backgroundsDispCanvas1.style.display = 'none';
                backgroundsPlusGalleriesDispCanvas1.style.display = 'none';
                cleanUp(player1);
                break;
        case 'stopPlayer2':
                player2.controls = false;
                player2.hidden = true;
                photoCanvas2.style.display = 'none';
                photoDispCanvas2.style.display = 'none';
                galleryDispCanvas2.style.display = 'none';
                backgroundsDispCanvas2.style.display = 'none';
                backgroundsPlusGalleriesDispCanvas2.style.display = 'none';
                cleanUp(player2);
                break;
        case 'stopPlayer3':
                player3.controls = false;
                player3.hidden = true;
                photoCanvas3.style.display = 'none';
                photoDispCanvas3.style.display = 'none';
                galleryDispCanvas3.style.display = 'none';
                backgroundsDispCanvas3.style.display = 'none';
                backgroundsPlusGalleriesDispCanvas3.style.display = 'none';
                cleanUp(player3);
                break;
    }
}

const showAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Hide';
        showHideAllPlayers.className = 'btn btn-primary';
        player1.controls = true;  //not going to use main laptop camera for this app
        player1.hidden = false; //not going to use main laptop camera for this app
        player2.controls = true;
        player2.hidden = false;
        player3.controls = true;
        player3.hidden = false;
}
const hideAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Show';
        showHideAllPlayers.className = 'btn btn-default';
        player1.controls = false;
        player2.controls = false;
        player3.controls = false;
        player1.hidden = true;
        player2.hidden = true;
        player3.hidden = true;
}
const doShowHideAllPlayers = () => {
    if (showHideAllPlayers.innerHTML === 'Show') {
        showAllPlayers();
    } else {
        hideAllPlayers();
    }
}

const playAllPlayers = () => {
        playPauseAllPlayers.innerHTML = 'Pause All';
        playPauseAllPlayers.className = 'btn btn-primary';
        if (showHideAllPlayers.innerHTML === 'Show') {//hidden at moment
            hideAllPlayers();
        }
        player1.play();
        player2.play();
        player3.play();
        pressedPlayAtLeastOnceAfterStartOfStreaming = true;
}
const pauseAllPlayers = () => {
        playPauseAllPlayers.innerHTML = 'Play All';
        playPauseAllPlayers.className = 'btn btn-default';
        player1.pause();
        player2.pause();
        player3.pause();
}
const doPlayPauseAllPlayers = (button) => {
    if (button.innerHTML === 'Pause All') {
        pauseAllPlayers();
    } else {
        playAllPlayers();
    }
}

const doChangePhotoWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoWidth = document.getElementById('photoWidth').value;
        photoHeight = document.getElementById('photoHeight').value;
    }
}

const doChangePhotoHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoWidth = document.getElementById('photoWidth').value;
        photoHeight = document.getElementById('photoHeight').value;
    }
}

const doChangeDispPhotoWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoDispWidth = document.getElementById('photoDispWidth').value;
        photoDispHeight = document.getElementById('photoDispHeight').value;
    }
}

const doChangeDispPhotoHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoDispWidth = document.getElementById('photoDispWidth').value;
        photoDispHeight = document.getElementById('photoDispHeight').value;
    }
}

const doShowHideSnapAllPhotos = (button) => {
    if (button.innerHTML === 'Hide') {
        snapAllPhotosArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        snapAllPhotosArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}


const doSnapAllPhotos = (categories) => {

    try {
        if (!pressedPlayAtLeastOnceAfterStartOfStreaming) {
            showMessages('warning','You havent pressed Play since started streaming.');
            return;
        }

        snapAllPhotos(categories === undefined ? {'none':'none'} : categories);

    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }
}

const doSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = true;
    doSnapAllPhotos();
}

const doStopSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = false;
}

const doSnapBackgroundAll = () => {
    doSnapAllPhotos({'Background':'Background'});
}


const doShowHideGallery = (button) => {
    if (button.innerHTML === 'Hide') {
        galleryArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        galleryArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}

const doShowHideBackgrounds = (button) => {
    if (button.innerHTML === 'Hide') {
        backgroundsArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        backgroundsArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}

const doShowNextPrevImageFromGallery = (button) => {
    try {
        if (button.id === 'showPrevImageFromGallery') {
            showPrevImageFromGallery();
        } else {
            showNextImageFromGallery();
        }
        if (showHideSelfMonoDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        } else if (showHideSelfColorDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        } else if (showHideSelfSolidDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        }
    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }
}

const doShowNextPrevImageFromBackgrounds = (button) => {
    try {
        if (button.id === 'showPrevImageFromBackgrounds') {
            showPrevImageFromBackgrounds();
        } else {
            showNextImageFromBackgrounds();
        }
        if (showHideSelfMonoDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        } else if (showHideSelfColorDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        } else if (showHideSelfSolidDifference.innerHTML === 'Reset' &&
            showHideBackgroundsPlusGalleries.innerHTML === 'Hide') { //NOT in reset and NOT hidden, but instead highlighting diff
            showMixedImagesSelfDifferences(typeOfDiff);
        }
    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }
}

const doShowHideBackgroundsPlusGalleries = (button) => {
    if (button.innerHTML === 'Hide') {
        backgroundsPlusGalleriesArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        backgroundsPlusGalleriesArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}

const doShowHideMixedImagesSelfMonoDifferences = (button) => {
    if (button.innerHTML === 'Monochrome') {
        colorMode.innerHTML = 'Monochrome - (Contrast)';
        button.innerHTML = 'Reset';
        button.className = 'btn btn-primary';
        showHideSelfColorDifference.innerHTML = 'Color';
        showHideSelfSolidDifference.innerHTML = 'Solid';
        showHideSelfColorDifference.className = 'btn btn-default';
        typeOfDiff = 'mono';
        showMixedImagesSelfDifferences(typeOfDiff);
    } else {
        button.innerHTML = 'Monochrome';
        button.className = 'btn btn-default';
        mixCurrentGalleryAndBackgroundImages();
    }
}

const doShowHideMixedImagesSelfColorDifferences = (button) => {
    if (button.innerHTML === 'Color') {
        colorMode.innerHTML = 'Color - (Contrast)';
        button.innerHTML = 'Reset';
        button.className = 'btn btn-primary';
        showHideSelfMonoDifference.innerHTML = 'Monochrome';
        showHideSelfSolidDifference.innerHTML = 'Solid';
        showHideSelfMonoDifference.className = 'btn btn-default';
        typeOfDiff = 'color';
        showMixedImagesSelfDifferences(typeOfDiff);
    } else {
        button.innerHTML = 'Color';
        button.className = 'btn btn-default';
        mixCurrentGalleryAndBackgroundImages();
    }
}

const doShowHideMixedImagesSelfSolidDifferences = (button) => {
    if (button.innerHTML === 'Solid') {
        colorMode.innerHTML = 'Solid - (Threshold)';
        button.innerHTML = 'Reset';
        button.className = 'btn btn-primary';
        showHideSelfMonoDifference.innerHTML = 'Monochrome';
        showHideSelfColorDifference.innerHTML = 'Color';
        showHideSelfMonoDifference.className = 'btn btn-default';
        typeOfDiff = 'solid';
        showMixedImagesSelfDifferences(typeOfDiff);
    } else {
        button.innerHTML = 'Solid';
        button.className = 'btn btn-default';
        mixCurrentGalleryAndBackgroundImages();
    }
}


const doSendFromGalleryToMixed = (button) => {
    if (button.innerHTML === 'Mix') {
        button.innerHTML = 'No Mix';
        button.className = 'btn btn-primary';
        sendCurrentGalleryToMixed = true;
    } else {
        button.innerHTML = 'Mix';
        button.className = 'btn btn-default';
        sendCurrentGalleryToMixed = false;
    }
}

const doSendFromBackgroundsToMixed = (button) => {
    if (button.innerHTML === 'Mix') {
        button.innerHTML = 'No Mix';
        button.className = 'btn btn-primary';
        sendCurrentBackgroundsToMixed = true;
    } else {
        button.innerHTML = 'Mix';
        button.className = 'btn btn-default';
        sendCurrentBackgroundsToMixed = false;
    }
}

const doLeftRightAlign = (slider) => {

    let value = parseInt(slider.value);

    let delta = Math.abs(value - prevMoveVal);
    if (value < prevMoveVal) { // moved left
        rightCanvasPos.x -= delta;
    } else {                   // moved right
        rightCanvasPos.x += delta;
    }
    prevMoveVal = value;
    mergeImagesRightToLeft(rightCanvasPos);
}

/******************************************************************************************************
 * execution
 *****************************************************************************************************/
playerWidth = document.getElementById('playerWidth').value;
playerHeight = document.getElementById('playerHeight').value;
photoWidth = document.getElementById('photoWidth').value;
photoHeight = document.getElementById('photoHeight').value;
photoDispWidth = document.getElementById('photoDispWidth').value;
photoDispHeight = document.getElementById('photoDispHeight').value;
hideAllPlayers();
generatedCategoryButtonsForSnapShot.innerHTML = generateCategoryButtons();
generatedCategoryButtonsForGalleryImage.innerHTML = generateCategoryButtons();