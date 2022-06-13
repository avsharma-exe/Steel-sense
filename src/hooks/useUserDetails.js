function useUserDetails() {
    return localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : {}
}

export default useUserDetails