function dayFunc() {
    const date = new Date();
    const month = date.getUTCMonth() + 1; //months from 1-12
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const month_day = month * 30.4
    const year1 = year * 365
    const total = day + month_day + year1
    return total
}
export default dayFunc



