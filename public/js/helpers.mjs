export function elementById(id) {
    return document.getElementById(id);
}

export function elementValueById(id) {
    return document.getElementById(id).value; 
}

export function arrSortingASC(arr, key, sortType) {
    if(sortType === 'Number') {
        arr.sort((a, b) => Number(a[key]) - Number(b[key]));
    }
    if(sortType === 'Date') {
        arr.sort((a, b) => new Date(a[key]) - new Date(b[key]));
    }
    return arr;
}

export function arrSortingDesc(arr, key, sortType) {    
    if(sortType === 'Number') {
        arr.sort((a, b) => Number(b[key] - Number(a[key])));
    }
    if(sortType === 'Date') {
        arr.sort((a, b) => new Date(b[key]) - new Date(a[key]));
    }
    return arr;
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function maxValueFromArrOfObj(arr, key) {
    return arr.reduce((acc, curr) => acc[key] > curr[key] ? acc : curr);
}

export function proportion(maxValue, value, maxHeight) {
    return Number( value * Number(maxHeight) / maxValue );
}

export function setDataInArr(arr) {
    let newArr = arr.map(function(item) {
        return item; 
    });

    return newArr;
}