export default function displayAmount(amt) {
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}