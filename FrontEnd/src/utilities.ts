export const siteUrl = "https://localhost:44336"
//export const siteUrl = "https://registrofitstic.azurewebsites.net"
export const logoUrl = "fitstic_logo.png"

export const adminRoute = "/adminpanel"
export const superAdminRoute = "/superpanel"
export const docentiRoute = "/docentipanel"

export const Digits2 = (n: number) => {
    return n < 10 ? "0" + n : n
}

export const validateTime = (time: string) => {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])$/.test(time)
}

export const formattaData = (d: string, convert?: boolean) => {
    let from = d.split(/[/-]/g),
    date = convert ? new Date(Number(from[2]), Number(from[1]) - 1, Number(from[0])) : new Date(d)

    return `${date.getFullYear()}-${Digits2(date.getMonth() + 1)}-${Digits2(date.getDate())}`
}

export const formatItalian = (d: string) => {
    let date = new Date(d)

    return `${Digits2(date.getDate())}-${Digits2(date.getMonth() + 1)}-${date.getFullYear()}` 
}

export const capitalizeFirst = (name: string) => {
    let splitStr = capitalizeQuote(name.toLowerCase()).split(" ")

    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1) 
    }
   
    return splitStr.join(" ")
}

export const capitalizeQuote = (name: string) => {
    let splitStr = name.toLowerCase().split("'")

    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
   
    return splitStr.join("'")
}

export const mountLogin = () => {
    let body = document.getElementsByTagName("body")[0]

    body.classList.add("login")
}
export const unmountLogin = () => {
    let body = document.getElementsByTagName("body")[0]

    body.classList.remove("login")
}

export const imageFileToBase64 = async (file: any) => {
    function readImageFile(file: any){
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
        
            reader.onload = e => {
                let base64Img = new Buffer(e.target.result as any, "binary").toString("base64"),
                src = "data:image/png;base64," + base64Img

                resolve(src)
            }
        
            reader.onerror = reject
        
            reader.readAsArrayBuffer(file)
        })     
    }

    return readImageFile(file)
}

export const resizePopup = () => {
    let mainBlock = document.getElementById("mainBlock"),
    popup = document.getElementById("popup"),
    width = mainBlock ? mainBlock.clientWidth : 0

    if(mainBlock && popup)
        popup.style.width = width + "px"
}

export const checkEnter = (e: any, callback: any) => {
    if(e.keyCode === 13)
        callback()
}

window.addEventListener("load", resizePopup)
window.addEventListener("resize", resizePopup)