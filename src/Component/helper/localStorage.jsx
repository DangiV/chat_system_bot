export const userlocalStorageData  = () =>{
    const localData = localStorage.getItem("userDetails")
    const userData = JSON.parse(localData)
    return userData
}