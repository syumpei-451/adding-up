'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2016 || year === 2021) {
        let value = null;
        if (prefectureDataMap.has(prefecture)) {
            value = prefectureDataMap.get(prefecture);
        } else {
            value = {
                popu16: 0,
                popu21: 0,
                change: null
            };
        }
        if (year === 2021) {
            value.popu21 = popu;
        }
        if (year === 2016) {
            value.popu16 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu21 / value.popu16;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}: ${value.popu16}=>${value.popu21}変化率: ${value.change}`;
    });
    console.log(rankingStrings);
});