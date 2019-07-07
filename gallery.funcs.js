'use strict';

const imageDataGallery1 = [];
const imageForDispOnlyGallery1 = [];
const imageDataGallery2 = [];
const imageForDispOnlyGallery2 = [];
const imageDataGallery3 = [];
const imageForDispOnlyGallery3 = [];
let   imageGalleryCurrentIndex = 0;

const snapAllPhotos = () => {
    const now = new Date().getHours() + '.' + new Date().getMinutes() + '.' + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    if (player1.srcObject.active) {
        photoCanvas1.width = photoWidth; photoCanvas1.height = photoHeight;
        photoDispCanvas1.width = photoDispWidth; photoDispCanvas1.height = photoDispHeight;
        imageDataGallery1.push(captureCameraImage(player1, photoCanvas1));
        imageForDispOnlyGallery1.push({time:now,categories:{'none':'none'},image:captureCameraImage(player1, photoDispCanvas1)});
    }
    if (player2.srcObject.active) {
        photoCanvas2.width = photoWidth; photoCanvas2.height = photoHeight;
        photoDispCanvas2.width = photoDispWidth; photoDispCanvas2.height = photoDispHeight;
        imageDataGallery2.push(captureCameraImage(player2, photoCanvas2));
        imageForDispOnlyGallery2.push({time:now,categories:{'none':'none'},image:captureCameraImage(player2, photoDispCanvas2)});
    }
    if (player3.srcObject.active) {
        photoCanvas3.width = photoWidth; photoCanvas3.height = photoHeight;
        photoDispCanvas3.width = photoDispWidth; photoDispCanvas3.height = photoDispHeight;
        imageDataGallery3.push(captureCameraImage(player3, photoCanvas3));
        imageForDispOnlyGallery3.push({time:now,categories:{'none':'none'},image:captureCameraImage(player3, photoDispCanvas3)});
    }
    if (snapAllPhotosContinuous === true) {
        snapContinuous();
    }
}
const snapContinuous = () => {
    setTimeout(() => { doSnapAllPhotos(true) }, 500);
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

const showNextImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex > whichImageGallery.length -2) {
        imageGalleryCurrentIndex = 0;
    } else {
        imageGalleryCurrentIndex++;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
}

const showPrevImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex > whichImageGallery.length -2) {
        imageGalleryCurrentIndex = 0;
    } else {
        imageGalleryCurrentIndex++;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
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
