function dayFunc(day, month, year) {
    let month_day = month * 30.4
    let year1 = year * 365
    let total = day + month_day + year1
    return total
}
export default dayFunc



