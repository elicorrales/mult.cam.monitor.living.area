'use strict';
////////////////////////////////////////////////////////////////////
//  a '1' means an object or part of an object.
//  a '0' means the background , the canvas, the area.
//  a '2' means that part of background has been scanned
//  and there was NOT an object (a '1').

let markedSquares = [
   //0  1  2  3  4
    [0, 0, 0, 0, 1], // 0
    [0, 0, 0, 0, 0], // 1
    [0, 0, 0, 0, 0], // 2
    [0, 0, 0, 0, 0], // 3
    [1, 0, 0, 0, 0], // 4
];

let imagesFound = [];

/*
let markedSquares = [
   //                    1 1 1 1 1
   //0 1 2 3 4 5 6 7 8 9 0 1 2 3 4
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 1
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0], // 2
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0], // 3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 4
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 5
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 6
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 7
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 8
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 9
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //10
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //11
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //12
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //13
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //14
];
*/

const findAnyMissedImages = (images, data) => {

    let numRows = data.length;
    let numCols = data[0].length;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            //check if value at curr col,row is a 1, and already within a found image
            //if it is, then we havent missed that value.
            let isOne = false;
            for (let image=0; image<images.length; image++) {
                if (data[row][col] === 1) {
                    isOne = true;
                    if (col>=images[image].topX && row>=images[image].topY && col<=images[image].botX && row<=images[image].botY) {
                            isOne = false;
                            break;//return [-1, -1];
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

        //if we found only one of the bottom right axis,
        // lets set the -1 to same as corresponding top left corner axis.
        if (botRghtCol >-1 && botRghtRow===-1) botRghtRow = topLeftRow;
        if (botRghtRow >-1 && botRghtCol===-1) botRghtCol = topLeftCol;

        //if we found image at bottom right limit of area, the bot right corner values
        //will incorrectly be at -1, so lets set them to top left values.
        if (botRghtCol===-1 && topLeftCol===data[0].length-1) botRghtCol = topLeftCol;
        if (botRghtRow===-1 && topLeftRow===data.length-1) botRghtRow = topLeftRow;

        //since we looked past the image, if imag is more than 1 square, we have to
        //shrink area identified
        if (botRghtCol > topLeftCol) botRghtCol--;
        if (botRghtRow > topLeftRow) botRghtRow--;

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
    return { found, 'topX': topLeftCol, 'topY': topLeftRow, 'botX': botRghtCol, 'botY': botRghtRow };
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
        images.push(image);
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
            images.push(image);
        } else {
            console.log('no image found at ', col, row);
        }
    }

    console.log(images);

    //find any missed images
    for (let i = 0; i < 5; i++) {

        let [col, row] = findAnyMissedImages(images, markedSquares);
        if (col < 0 || row < 0) {
            console.log('no missed areas are left');
            break;
        }

        let image = findImageStartingAt(markedSquares, col, row);
        if (image.found) {
            //console.table(image);
            images.push(image);
        } else {
            console.log('no image found at ', col, row);
        }
    }

}

findAllImages(markedSquares, imagesFound);
console.table(imagesFound);
console.table(markedSquares);