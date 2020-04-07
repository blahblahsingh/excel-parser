const {getKeyByValue} = require('./helpers');
const { countryCode } = require('./countryCode');
const { sectorCode } = require('./sectorCode');

class OverallGDP {
    constructor(name,vals,scenarioCode,labelType){
        this.name = name,
        this.code = labelType === "Countries" ? 
            getKeyByValue(countryCode,name) : getKeyByValue(sectorCode,name);
        this.getValues = () => {
            const scenarioVals = {};
            vals.map((val,index) => {
                scenarioVals[scenarioCode[index]] = val;
            })
            return scenarioVals;
        },
        this.values = this.getValues()
    }
}

module.exports = {OverallGDP};