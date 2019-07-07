'use strict';

let pressedPlayAtLeastOnceAfterStartOfStreaming = false;
let snapAllPhotosContinuous = false;

let photoDispWidth = 0;
let photoDispHeight = 0;

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

const doStartStopAllCameras = () => {
    try {
        if (startStopAllCameras.innerHTML === 'Stream All') {
            startAllCameras();
            showMessages('info','Camera Feeds Starting....');
            startStopAllCameras.innerHTML = 'Stop All';
            startStopAllCameras.className = 'btn btn-primary';
            playPauseAllPlayers.disabled = false;
            photoCanvas1.style.display = 'inline';
            photoCanvas2.style.display = 'inline';
            photoCanvas3.style.display = 'inline';
            photoDispCanvas1.style.display = 'inline';
            photoDispCanvas2.style.display = 'inline';
            photoDispCanvas3.style.display = 'inline';
            galleryDispCanvas1.style.display = 'inline';
            galleryDispCanvas2.style.display = 'inline';
            galleryDispCanvas3.style.display = 'inline';
        } else {
            stopAllCameras();
            showMessages('info','Camera Feeds Stopping....');
            startStopAllCameras.innerHTML = 'Stream All';
            startStopAllCameras.className = 'btn btn-default';
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
                //photoCanvas1.width = 0;
                //photoCanvas1.height = 0;
                photoCanvas1.style.display = 'none';
                photoDispCanvas1.style.display = 'none';
                galleryDispCanvas1.style.display = 'none';
                cleanUp(player1);
                break;
        case 'stopPlayer2':
                player2.controls = false;
                player2.hidden = true;
                photoCanvas2.style.display = 'none';
                photoDispCanvas2.style.display = 'none';
                galleryDispCanvas2.style.display = 'none';
                cleanUp(player2);
                break;
        case 'stopPlayer3':
                player3.controls = false;
                player3.hidden = true;
                photoCanvas3.style.display = 'none';
                photoDispCanvas3.style.display = 'none';
                galleryDispCanvas3.style.display = 'none';
                cleanUp(player3);
                break;
    }
}

const showAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Hide All';
        showHideAllPlayers.className = 'btn btn-primary';
        player1.controls = true;
        player2.controls = true;
        player3.controls = true;
        player1.hidden = false;
        player2.hidden = false;
        player3.hidden = false;
}
const hideAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Show All';
        showHideAllPlayers.className = 'btn btn-default';
        player1.controls = false;
        player2.controls = false;
        player3.controls = false;
        player1.hidden = true;
        player2.hidden = true;
        player3.hidden = true;
}
const doShowHideAllPlayers = () => {
    if (showHideAllPlayers.innerHTML === 'Show All') {
        showAllPlayers();
    } else {
        hideAllPlayers();
    }
}

const playAllPlayers = () => {
        playPauseAllPlayers.innerHTML = 'Pause All';
        playPauseAllPlayers.className = 'btn btn-primary';
        if (showHideAllPlayers.innerHTML === 'Show All') {//hidden at moment
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
const doPlayPauseAllPlayers = () => {
    if (playPauseAllPlayers.innerHTML === 'Pause All') {
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


const doSnapAllPhotos = () => {

    if (!pressedPlayAtLeastOnceAfterStartOfStreaming) {
        showMessages('warning','You havent pressed Play since started streaming.');
        return;
    }

    snapAllPhotos();
}

const doSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = true;
    doSnapAllPhotos();
}

const doStopSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = false;
}


const doShowNextPrevImageFromGallery = (button) => {
    if (button.id === 'showPrevImageFromGallery') {
        showPrevImageFromGallery();
    } else {
        showNextImageFromGallery();
    }
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
generatedCategoryButtons.innerHTML = generateCategoryButtons();