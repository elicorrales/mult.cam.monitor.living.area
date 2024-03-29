'use strict';
////////////////////////////////////////////////////////////////////
//  a '1' means an object or part of an object.
//  a '0' means the background , the canvas, the area.
//  a '2' means that part of background has been scanned
//  and there was NOT an object (a '1').
/*
let markedSquares = [
   //0  1  2  3  4
    [1, 1, 0, 1, 1], // 0
    [1, 1, 0, 1, 1], // 1
    [0, 1, 0, 1, 0], // 2
    [1, 1, 0, 1, 1], // 3
    [1, 1, 0, 1, 1], // 4
];

let imagesFound = [];
*/

const seeIfAnyImageIsActuallyMoreThanOneImage = (images, markedSquares) => {

    let newImagesFound = [];
    images.forEach(image => {

        //first grab just the portion of area corresponding to the image.
        let area = [];
        for (let row=0; row<=image.botY; row++) {
            area[row] = [];
            for (let col=0; col<=image.botX; col++) {
                if (col>=image.topX && row>=image.topY) {
                    area[row][col] = markedSquares[row][col];
                } else {
                    area[row][col] = 0;
                }
            }
        }
        let img = findImageStartingAt(area, image.topX, image.topY);
        if (img.found) {
            newImagesFound.push(img);
            let imgToRightOfNewImg = findImageStartingAt(area, img.botX+1, image.topY);
            if (imgToRightOfNewImg.found) {
                newImagesFound.push(imgToRightOfNewImg);
            }
            let imgBelowNewImg = findImageStartingAt(area, img.topX, image.botY+1);
            if (imgBelowNewImg.found) {
                newImagesFound.push(imgBelowNewImg);
            }
        }
    });

    return newImagesFound;
}

const isImageAlreadyFound = (images, image) => {

    if (images === undefined || images === null || images.length === 0) return false;

    let exists = false;
    images.forEach(img => { if (img.key === image.key) { exists = true; return; } })
    return exists;
}

const findAnyMissedImages = (images, data) => {

    let numRows = data.length;
    let numCols = data[0].length;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {

            let isOne = false;
            //check if value at curr col,row is a 1, and already within a found image
            //if it is, then we havent missed that value.
            if (data[row][col] === 1) {
                if (images === undefined || images === null || images.length<1) {
                    isOne = true;
                } else {
                    for (let image=0; image<images.length; image++) {
                        isOne = true;
                        if (col>=images[image].topX && row>=images[image].topY && col<=images[image].botX && row<=images[image].botY) {
                            isOne = false;
                            break;//return [-1, -1];
                        }
                    }
                }
            }
            //if isOne and we are here, that means we found a 1 that is NOT already part of a found image.
            if (isOne) {
                return [col, row];
            }
        }
    }
    return [-1, -1];
}


const findRowColAreaNotChecked = (data) => {
    let [col, row] = findFirstRowColContainVal(data, [0]);
    //console.log('topX:', col, ' topY:', row);
    return [col, row];
}

const findFirstRowColContainVal = (data, values) => {
    let numRows = data.length;
    let numCols = data[0].length;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (values.includes(data[row][col])) {
                return [col, row];
            }
        }
    }
    return [-1, -1];
}

const fillInAllZerosWithinImageFound = (data, topLeftCol, topLeftRow, botRghtCol, botRghtRow) => {

    for (let row = topLeftRow; row <= botRghtRow; row++) {
        for (let col = topLeftCol; col <= botRghtCol; col++) {
            if (data[row][col] === 0) {
                data[row][col] = 2;
            }
        }
    }

}

const findImageStartingAt = (data, colStart, rowStart) => {
    let found = false;
    let topLeftRow = findNextRowContainValAfterCol(data, [1], rowStart, colStart);
    let topLeftCol = findNextColContainValAfterRow(data, [1], colStart, rowStart);
    let botRghtRow = -1;
    let botRghtCol = -1;
    if (topLeftRow>-1 && topLeftCol>-1) {
        found = true;
        botRghtRow = findNextRowNotContainValAfterCol(data, [1], topLeftRow, topLeftCol);
        botRghtCol = findNextColNotContainValAfterRow(data, [1], topLeftCol, topLeftRow);

        //since we looked past the image, if imag is more than 1 square, we have to
        //shrink area identified
        if (botRghtCol > topLeftCol) botRghtCol--;
        if (botRghtRow > topLeftRow) botRghtRow--;

        // there are no zero rows below image
        if (botRghtRow < 0) {
            botRghtRow = data.length-1;
        }
        // there are no zero cols to right of image
        if (botRghtCol < 0) {
            botRghtCol = data[0].length-1;
        }
        
        //if area is ONLY 1 square big, then it had better be a  1 (an image)
        if (found && topLeftCol === botRghtCol &&
            topLeftRow === botRghtRow &&
            data[topLeftRow][topLeftCol] !== 1) {
            found = false;
        }

        if (found) {
            fillInAllZerosWithinImageFound(data, topLeftCol, topLeftRow, botRghtCol, botRghtRow);
        }
    }
    let key = topLeftCol + '.' + topLeftRow + '.' + botRghtCol + '.' +botRghtRow;
    return { found, key, 'topX': topLeftCol, 'topY': topLeftRow, 'botX': botRghtCol, 'botY': botRghtRow };
}

const isRowContain = (data, row, values, colStart) => {
    let numCols = data[0].length;
    for (let i = colStart; i < numCols; i++) {

        // mark what we've checked already
        if (i > 0 && data[row][i - 1] !== 1) {
            data[row][i - 1] = 2;
        }

        if (values.includes(data[row][i])) {
            return true;
        }
    }
    if (data[row][numCols - 1] !== 1) data[row][numCols - 1] = 2;
    return false;
}

const isColContain = (data, col, values, colStart) => {
    let numRows = data.length;
    for (let i = colStart; i < numRows; i++) {

        // mark what we've checked already
        if (i > 0 && data[i - 1][col] !== 1) {
            data[i - 1][col] = 2;
        }

        if (values.includes(data[i][col])) {
            return true;
        }
    }
    if (data[numRows - 1][col] !== 1) data[numRows - 1][col] = 2;
    return false;
}

const findNextRowContainValAfterCol = (data, values, rowStart, colStart) => {
    let numRows = data.length;
    let topRow = -1;
    for (let i = rowStart; i < numRows; i++) {
        if (isRowContain(data, i, values, colStart)) {
            topRow = i;
            break;
        }
    }
    //console.table(data);
    return topRow;
}

const findNextRowNotContainValAfterCol = (data, values, rowStart, colStart) => {
    let numRows = data.length;
    let topRow = -1;
    for (let i = rowStart; i < numRows; i++) {
        if (!isRowContain(data, i, values, colStart)) {
            topRow = i;
            break;
        }
    }
    //console.table(data);
    return topRow;
}


const findNextColContainValAfterRow = (data, values, colStart, rowStart) => {
    let numCols = data[0].length;
    let topCol = -1;
    for (let i = colStart; i < numCols; i++) {
        if (isColContain(data, i, values, rowStart)) {
            topCol = i;
            break;
        }
    }
    //console.table(data);
    return topCol;
}

const findNextColNotContainValAfterRow = (data, values, colStart, rowStart) => {
    let numCols = data[0].length;
    let topCol = -1;
    for (let i = colStart; i < numCols; i++) {
        if (!isColContain(data, i, values, rowStart)) {
            topCol = i;
            break;
        }
    }
    //console.table(data);
    return topCol;
}


//debugger;

const findAllImages = (markedSquares, images) => {

    //find the FIRST image
    let image = findImageStartingAt(markedSquares, 0, 0);
    if (image.found) {
        //console.table(image);
        if (!isImageAlreadyFound(images, image)) images.push(image);
    } else {
        console.log('no image found at ', 0, 0);
        //markedSquares[col][row] = 2;
    }

    //find all the REST of the images
    for (let i = 0; i < 5; i++) {

        //console.table(markedSquares);

        //  [ x ,  y ]
        let [col, row] = findRowColAreaNotChecked(markedSquares);
        if (col < 0 || row < 0) {
            console.log('no unchecked areas are left');
            break;
        }

        let image = findImageStartingAt(markedSquares, col, row);
        if (image.found) {
            //console.table(image);
            if (!isImageAlreadyFound(images, image)) images.push(image);
        } else {
            console.log('no image found at ', col, row);
        }
    }

    //find any missed images
    for (let i = 0; i < markedSquares.length*markedSquares[0].length; i++) {

        let [col, row] = findAnyMissedImages(images, markedSquares);
        if (col < 0 || row < 0) {
            console.log('no missed areas are left');
            break;
        }

        let image = findImageStartingAt(markedSquares, col, row);
        if (image.found) {
            //console.table(image);
            if (!isImageAlreadyFound(images, image)) images.push(image);
        } else {
            console.log('no image found at ', col, row);
        }
    }

    //console.table(images);
    images = seeIfAnyImageIsActuallyMoreThanOneImage(images, markedSquares);
    console.table(images);
}

//findAllImages(markedSquares, imagesFound);
//console.table(imagesFound);
//console.table(markedSquares);