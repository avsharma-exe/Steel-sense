export default function displayAmount(amt) {
    return amt === null ? "NA" : "₹" + amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}