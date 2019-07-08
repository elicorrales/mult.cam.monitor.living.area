'use strict';

const backgroundDataGallery1 = [];
const hiResBackgroundGallery1 = [];
const backgroundDataGallery2 = [];
const hiResBackgroundGallery2 = [];
const backgroundDataGallery3 = [];
const hiResBackgroundGallery3 = [];
let   backgroundsCurrentIndex = 0;

const imageDataGallery1 = [];
const imageForDispOnlyGallery1 = [];
const imageDataGallery2 = [];
const imageForDispOnlyGallery2 = [];
const imageDataGallery3 = [];
const imageForDispOnlyGallery3 = [];
let   imageGalleryCurrentIndex = 0;

const snapPhoto = (whichPlayer, whichPhotoCanvas, whichPhotoDispCanvas, whichImageDataGallery, whichImageForDispOnlyGallery, categories) => {
    const now = new Date().getHours() + '.' + new Date().getMinutes() + '.' + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    whichPhotoCanvas.width = photoWidth; whichPhotoCanvas.height = photoHeight;
    whichPhotoDispCanvas.width = photoDispWidth; whichPhotoDispCanvas.height = photoDispHeight;
    whichImageDataGallery.push(captureCameraImage(whichPlayer, whichPhotoCanvas));
    whichImageForDispOnlyGallery.push({time:now,categories,image:captureCameraImage(whichPlayer, whichPhotoDispCanvas)});
}
const snapAllPhotos = (categories) => {
    if (player1.srcObject.active) {
        if (categories.Background !== undefined) {
            snapPhoto(player1, photoCanvas1, photoDispCanvas1, backgroundDataGallery1, hiResBackgroundGallery1, categories);
        } else {
            snapPhoto(player1, photoCanvas1, photoDispCanvas1, imageDataGallery1, imageForDispOnlyGallery1, categories);
        }
    }
    if (player2.srcObject.active) {
        if (categories.Background !== undefined) {
            snapPhoto(player2, photoCanvas2, photoDispCanvas2, backgroundDataGallery2, hiResBackgroundGallery2, categories);
        } else {
            snapPhoto(player2, photoCanvas2, photoDispCanvas2, imageDataGallery2, imageForDispOnlyGallery2, categories);
        }
    }
    if (player3.srcObject.active) {
        if (categories.Background !== undefined) {
            snapPhoto(player3, photoCanvas3, photoDispCanvas3, backgroundDataGallery3, hiResBackgroundGallery3, categories);
        } else {
            snapPhoto(player3, photoCanvas3, photoDispCanvas3, imageDataGallery3, imageForDispOnlyGallery3, categories);
        }
    }
    if (snapAllPhotosContinuous === true) {
        snapContinuous();
    }
}
const snapContinuous = () => {
    setTimeout(() => { doSnapAllPhotos(true) }, 500);
}


const mixCurrentGalleryAndBackgroundImages = () => {
    if (imageForDispOnlyGallery1.length >0 && hiResBackgroundGallery1.length > 0) {
        mixTwoImagesOntoCanvas(
            imageForDispOnlyGallery1[imageGalleryCurrentIndex].image, hiResBackgroundGallery1[backgroundsCurrentIndex].image, 
            backgroundsPlusGalleriesDispCanvas1, createDifference);
    }
    if (imageForDispOnlyGallery2.length >0 && hiResBackgroundGallery2.length > 0) {
        mixTwoImagesOntoCanvas(
            imageForDispOnlyGallery2[imageGalleryCurrentIndex].image, hiResBackgroundGallery2[backgroundsCurrentIndex].image, 
            backgroundsPlusGalleriesDispCanvas2, createDifference);
    }
    if (imageForDispOnlyGallery3.length >0 && hiResBackgroundGallery3.length > 0) {
        mixTwoImagesOntoCanvas(
            imageForDispOnlyGallery3[imageGalleryCurrentIndex].image, hiResBackgroundGallery3[backgroundsCurrentIndex].image, 
            backgroundsPlusGalleriesDispCanvas3, createDifference);
    }
}


const displayGalleryImageInfo = (whichImageForDispOnlyGallery, whichGalleryDispCanvas, index, whichCategories) => {
    let ctx = whichGalleryDispCanvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, whichGalleryDispCanvas.width, whichGalleryDispCanvas.height);
    if (whichImageForDispOnlyGallery.length > 0 ) {
        putImageOnCanvas(whichImageForDispOnlyGallery[index].image, whichGalleryDispCanvas);
        whichCategories.style.backgroundColor = whichImageForDispOnlyGallery[index].categories.none !== undefined ?'red':'';
        whichCategories.innerHTML = JSON.stringify(whichImageForDispOnlyGallery[index].categories);
    }
}

const displayImagesFromGallery = (index) => {
    displayGalleryImageInfo(imageForDispOnlyGallery1, galleryDispCanvas1, index, categories1);
    displayGalleryImageInfo(imageForDispOnlyGallery2, galleryDispCanvas2, index, categories2);
    displayGalleryImageInfo(imageForDispOnlyGallery3, galleryDispCanvas3, index, categories3);
}

const getWhichGallery = () => {
    let len1 = imageForDispOnlyGallery1.length;
    let len2 = imageForDispOnlyGallery2.length;
    let len3 = imageForDispOnlyGallery3.length;
    let whichImageGallery;
    if (len1>0 && len2>0 && len3>0 && (len1 != len2 || len1 != len3 || len2 != len3)) {
        throw 'Galleries of Different Length!!';
    }
    if (len1>0) {
        whichImageGallery = imageForDispOnlyGallery1;
    } else if (len2>0) {
        whichImageGallery = imageForDispOnlyGallery2;
    } else if (len3>0) {
        whichImageGallery = imageForDispOnlyGallery3;
    } else {
        throw 'No Image Gallery';
    }
    return whichImageGallery;
}

const showNextImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex > whichImageGallery.length -2) {
        imageGalleryCurrentIndex = 0;
    } else {
        imageGalleryCurrentIndex++;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
    if (sendCurrentGalleryToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}

const showPrevImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex > whichImageGallery.length -2) {
        imageGalleryCurrentIndex = 0;
    } else {
        imageGalleryCurrentIndex++;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
    if (sendCurrentGalleryToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}


const getWhichBackgrounds = () => {
    let len1 = hiResBackgroundGallery1.length;
    let len2 = hiResBackgroundGallery2.length;
    let len3 = hiResBackgroundGallery3.length;
    let whichBackgrounds;
    if (len1>0 && len2>0 && len3>0 && (len1 != len2 || len1 != len3 || len2 != len3)) {
        throw 'Backrounds of Different Length!!';
    }
    if (len1>0) {
        whichBackgrounds = hiResBackgroundGallery1;
    } else if (len2>0) {
        whichBackgrounds = hiResBackgroundGallery2;
    } else if (len3>0) {
        whichBackgrounds = hiResBackgroundGallery3;
    } else {
        throw 'No Backgrounds';
    }
    return whichBackgrounds;
}

const displayBackgroundsImageInfo = (whichHiResBackgroundGallery, whichBackgroundDispCanvas, index) => {
    let ctx = whichBackgroundDispCanvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, whichBackgroundDispCanvas.width, whichBackgroundDispCanvas.height);
    if (whichHiResBackgroundGallery.length > 0 ) {
        putImageOnCanvas(whichHiResBackgroundGallery[index].image, whichBackgroundDispCanvas);
    }
}

const displayImagesFromBackgrounds = (index) => {
    displayBackgroundsImageInfo(hiResBackgroundGallery1, backgroundsDispCanvas1, index);
    displayBackgroundsImageInfo(hiResBackgroundGallery2, backgroundsDispCanvas2, index) 
    displayBackgroundsImageInfo(hiResBackgroundGallery3, backgroundsDispCanvas3, index);
}


const showNextImageFromBackgrounds = () => {
    let whichBackgrounds = getWhichBackgrounds();
    if (backgroundsCurrentIndex > whichBackgrounds.length -2) {
        backgroundsCurrentIndex = 0;
    } else {
        backgroundsCurrentIndex++;
    }
    displayImagesFromBackgrounds(backgroundsCurrentIndex);
    if (sendCurrentBackgroundsToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}

const showPrevImageFromBackgrounds = () => {
    let whichBackgrounds = getWhichBackgrounds();
    if (backgroundsCurrentIndex > whichBackgrounds.length -2) {
        backgroundsCurrentIndex = 0;
    } else {
        backgroundsCurrentIndex++;
    }
    displayImagesFromBackgrounds(backgroundsCurrentIndex);
    if (sendCurrentBackgroundsToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}


const savePhotos = () => {
    if (player1.srcObject.active) {
        photoCanvas1.toBlob(blob => {
            saveAs(blob,'photo-1-'+now);
        });
    }
    if (player2.srcObject.active) {
        photoCanvas2.toBlob(blob => {
            saveAs(blob,'photo-2-'+now);
        });
    }
    if (player3.srcObject.active) {
        photoCanvas3.toBlob(blob => {
            saveAs(blob,'photo-3-'+now);
        });
    }
}
