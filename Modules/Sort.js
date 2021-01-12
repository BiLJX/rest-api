class Sort{
    popular(data){
        for (let i = 0; i <= data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[i].views < data[j].views) {
                    const temp = data[i]
                    data[i] = data[j]
                    data[j] = temp
                }
            }
        }
        return data
    }
    least(data){
        for (let i = 0; i <= data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[i].views > data[j].views) {
                    const temp = data[i]
                    data[i] = data[j]
                    data[j] = temp
                }
            }
        }
        return data
    }
    trending(tData, date){
        for(let i = 0; i<tData.length; i++){
            for (let j = i+1; i<tData.length; i++){
                let views1 = tData[i].views;
                let views2 = tData[j].views;
                let totalDate1 = tData[i].date.totalDate;
                let totalDate2 = tData[j].date.totalDate;
                let diff1 = date - totalDate1;
                let diff2 = date - totalDate2;
                let rate1 = views1/diff1;
                let rate2 = views2/diff2;
                if(rate1<rate2){
                    const temp = data[i]
                    tData[i] = data[j]
                    tData[j] = temp
                }
            }
        }
        return tData
    }
}
export default Sort






