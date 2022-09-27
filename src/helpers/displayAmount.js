export default function displayAmount(amt) {
    return amt === null || amt === undefined ? "NA" : "₹" + amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}