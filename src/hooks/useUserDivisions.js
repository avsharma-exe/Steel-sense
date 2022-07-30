function useUserDivisions() {
    let division = localStorage.getItem("userDivisions") ? localStorage.getItem("userDivisions") : [];
    console.log(typeof(division))
    let divisions = typeof(division) === "number" ? [division] : division.split(",")
    return divisions;
}

export default useUserDivisions
