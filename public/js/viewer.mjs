"use strict";
import { getIndexNames, getRengeByDate } from './transactions.mjs';
import { 
    elementById, 
    elementValueById, 
    arrSortingASC, 
    arrSortingDesc,
    capitalize,
    maxValueFromArrOfObj,
    proportion,
    setDataInArr
 } from './helpers.mjs';
import { 
    DAY_TEXT, 
    DEFAULT_START_DATE, 
    DEFAULT_END_DATE, 
    DATE_MIN, 
    DB_TEXT, 
    DATA_TEXT,
    CHART_SELECT_ELEM,
    MAX_CHAT_DIV_HEIGHT,
    NUMBER_TXT,
    DATE_TXT,
    ACTIVE_ASC,
    ACTIVE_DESC 
} from './const.mjs';

let app = undefined;
let dbData = [];
let chartData = [];
let indexesList = [];
let startDate = DEFAULT_START_DATE;
let endDate = DEFAULT_END_DATE;

/***
 * Create App wrapper, one public method in this module, other methods is hidden
 * @param htmlElement - main HTML element
 */
export function createTemplate(htmlElementId) {
    app = elementById(htmlElementId);
    getTableIndexes();
}

//----------- Main functions

function getError(event) {
    console.log(event)
}

/***
 * getIndexList
 * @param data - set list of indexes from DB as indexesList
 */
function getIndexList(data) {;
    let entries = Object.entries(data);
    indexesList.push(DAY_TEXT);
    entries.forEach(element => {
        if(element[1] !== DAY_TEXT) {
            let txt = String(element[1]);
            indexesList.push(txt);
        }
    });

    getDB_Data();
}

/***
 * get list of indexes from DB as indexesList
 */
function getTableIndexes() {
    getIndexNames(DB_TEXT, DATA_TEXT).then(
        getIndexList, //success
        getError //error
    ).catch(console.log.bind(console));
}  


/***
 * Set data range as dbData & chartData
 */

function setDB_Data(data) {
    dbData = setDataInArr(data);
    chartData = setDataInArr(data);

    createHTML();
}

function selectDB_DataError(event) {
    console.log('Error: ' + event);
}

/***
 * Get data range from datepickers data
 */
function getDB_Data() {
    getRengeByDate(DB_TEXT, DATA_TEXT, DAY_TEXT, startDate, endDate).then(
        setDB_Data,
        selectDB_DataError
    );
    
}

/***
 * Create view
 */
function createHTML() {
    let template = '<div class="wrapper">';
    template += '<div id="dateSelectorWrapper"></div>';
    template += '<div id="chartWrapper"></div>';
    template += '<div id="tableWrapper"></div>';
    template += '</div>';
    app.innerHTML = template;
    createDateSelector('dateSelectorWrapper');   
    createChart('chartWrapper');
    createTable('tableWrapper');
}

//----------- end main functions

//----------- Date selector
/***
 * Start date can't be higher end date.
 * End date can't be smaller start date. 
 */
function createDateSelector(htmlElementId) {
    let element = elementById(htmlElementId);
    let html = '<div class="dateWrapper">';
    html += '<input type="date" value="'+startDate+'" min="'+DATE_MIN+'" max="'+endDate+'" id="startDate" class="dateSelect">';
    html += '<input type="date" value="'+endDate+'" min="'+startDate+'" max="'+DEFAULT_END_DATE+'" id="endDate" class="dateSelect">';
    html += '</div>';

    element.innerHTML = html;
    setChangeListener([ "startDate", "endDate" ]);
}

/***
 * Set listeners for all HTML elements in arr (ex.: [ "startDate", "endDate" ])
 */
function setChangeListener(arr) {
    arr.forEach(function(item){
        let elem = elementById(item);
        elem.addEventListener( "change" , () => changeDateLister());
    })
}

function changeDateLister() {
    startDate = elementValueById('startDate');
    endDate = elementValueById('endDate');
    getDB_Data(); 
}

//----------- End date selector

//----------- Chart

function createChart(htmlElementId) {
    let element = elementById(htmlElementId);
    let html = '';
    html += '<div class="selectWrapper">';
    html += '<select id="'+CHART_SELECT_ELEM+'">';
    html += createChartSelect(CHART_SELECT_ELEM);
    html += '</select>';
    html += '</div>';
    html += '<div class="chartWrapper">';
    html += '<div id="chart"></div>'
    html += '</div>';

    element.innerHTML = html; 
    setChangeChartListener(CHART_SELECT_ELEM);
    let elem = elementById(CHART_SELECT_ELEM)
    sortChartData(elem.options[elem.selectedIndex])
}

function createChartSelect() {
    let html = '';
    indexesList.forEach(item => {
        if(item !== DAY_TEXT) {
            html += '<option value="'+item+'">' + capitalize( String(item.replaceAll('_', ' ')) ) + '</option>' ;
        }
    });   

    return html;
}

function setChangeChartListener(htmlElementId) {
    let elem = elementById(htmlElementId); 
    elem.addEventListener( "change" , () => sortChartData(elem.options[elem.selectedIndex]));
}

function sortChartData(option) {
    let maxValue = maxValueFromArrOfObj(chartData, option.value);
    createChartElements(option.value, maxValue)
}

function createChartElements(key, maxValue) {
    let element = elementById("chart");
    let maxDivHeight = maxValue[key];
    if(maxDivHeight == 0) {
        maxDivHeight = 10;
    }
    let html = '';

    chartData.forEach(function(item){
        let height = proportion(maxDivHeight, item[key], MAX_CHAT_DIV_HEIGHT);
        if(height == 0) {
            height = 20;
        }
        html += '<div class="chartBlock" style="height:'+height+'px">';
        html += '<div class="chartBlockDate">';
        html += item.day;
        html += '</div>'
        html += '<div class="chartBlockValue">';
        html += item[key];
        html += '</div>'
        html += '</div>'
    })
    element.innerHTML = html;
}

//----------- End chart

//----------- Start table

function createTable(htmlElementId) {
    let element = elementById(htmlElementId);
    let html = '';
    html += '<div class="tableWrapper">';
    html += '<table>'
    html += '<thead>';
    html += '<tr>';
    indexesList.forEach(item => {
        html += '<th id="'+item+'">' + capitalize( String(item.replaceAll('_', ' ')) ) + '</th>';
    });
    html += '</tr>';
    html += '<thead>';
    html += '</thead>';
    html += '<tbody id="tableData">';
    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    element.innerHTML = html;
    setTableHeadListener(); 
    setDefaultCSS_Class();
    setTableData('tableData');
}

function setDefaultCSS_Class() {
    let elem = elementById(DAY_TEXT);
    elem.className = 'activeASC'
}

function setTableHeadListener() {
    indexesList.forEach(function(key){
        let elem = elementById(key);
        elem.addEventListener( "click" , () => sortTableClickListener(key));
    });   
}

function setTableData(htmlElementId) {
    let element = elementById(htmlElementId);
    let html = '';
    dbData.forEach(item => {
        html += '<tr>';
        html += sortByTableIndex(item); 
        html += '</tr>'
    });    
    element.innerHTML = html;  
}

function sortByTableIndex(item) {
    let html = '';
    indexesList.forEach(function(key){
        html += '<td>' + item[key] + '</td>';
    });

    return html;
}

function sortTableClickListener(key) {
    let element = elementById(key);
    let sortType = NUMBER_TXT;
    if(key == DAY_TEXT) {
        sortType = DATE_TXT;
    }
    if( (element.className == '') || (element.className == ACTIVE_DESC) ){
        clearAllSortimgCSS_Classes();
        element.className = ACTIVE_ASC;
        dbData = arrSortingASC(dbData, key, sortType);
    } else {
        element.className = ACTIVE_DESC;
        dbData = arrSortingDesc(dbData, key, sortType);
    }
    setTableData('tableData');
}

function clearAllSortimgCSS_Classes() {
    indexesList.forEach(function(key){
        let elem = elementById(key);
        elem.className = '';
    })
}

//----------- End table