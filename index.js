const xlsx = require('node-xlsx').default;
const { countryCode } = require('./countryCode');
// const { sectorCode } = require('./sectorCode');
const {getKeyByValue} = require('./helpers');
const {OverallGDP} = require('./constructors');

const workSheetsFromFile = xlsx.parse(`${__dirname}/test-file.xlsx`);


let overallGdp = [];
let quarterlyGdp = [];
let gdpComponents = [];
const filter = [];
const countriesList = [];
const sectorsList = [];
const scenarioCode = [];
const countries = [];
const sectors = [];
workSheetsFromFile.map(sheet => {
    if(sheet.name === "Overall GDP") {
        overallGdp.push(...sheet.data);
        overallGdp = overallGdp.splice(-(overallGdp.length-12), overallGdp.length-1);
        console.log(overallGdp);
    }
    if(sheet.name === 'Quarterly GDP') {
        quarterlyGdp.push(...sheet.data);
        quarterlyGdp = quarterlyGdp.splice(-(quarterlyGdp.length-12), quarterlyGdp.length - 1);
        // console.log(quarterlyGdp);
    }
    if(sheet.name === 'GDP Components') {
        gdpComponents.push(...sheet.data);
    }
});

//Get Filter Data
overallGdp[0].forEach((element,index) => {
    if(element !== 'Label' && element !== 'Sub level'){
        const key = 'SCN_'+(index-2);
        filter[key] = element;
        scenarioCode.push(key);
    }
});

//get Graph Data
let listLabel = 'Countries';
overallGdp.forEach((el,index)=>{
    if(index !== 0){
        if(el[0] === 'Top Sectors') listLabel = "Sectors";

        const vals = [];
        el.forEach((val,index) => {
            if(index>1) vals.push(val);
        })

        if(listLabel === 'Countries'){
            //Collect metaData - countrieslist
            countriesList[getKeyByValue(countryCode,el[1])] = el[1];
            //Collect graph data - countries
            countries.push(new OverallGDP(el[1],vals,scenarioCode,listLabel));
        }
        if(listLabel === "Sectors"){
            //Collect metaData - sectorslist
            sectorsList[getKeyByValue(countryCode,el[1])] = el[1];
            //Collect graph data - sectors
            sectors.push(new OverallGDP(el[1],vals,scenarioCode,listLabel));
        }
        

    }
})

//get Quarterly Gdp Data
console.log(quarterlyGdp[2][0]);

// Collate final response
const response = {
    metaData : {
        filter : filter,
        countries: countriesList,
        sectors: sectorsList
    },
    data:{
        countries : countries,
        sectors : sectors
    },
    quarterlyGdp: [],
    gdpComponents: [],
    importExport: [],
    sectorGainLoss: []
}
// console.log('response Stringy',JSON.stringify(response));
console.log('countries data',response.data.countries);
console.log('sectors data',response.data.sectors);
