export const siteUrl = "https://localhost:44336" // https://avocadoapi.azurewebapps.net
export const logoUrl = "https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png"

export const adminRoute = "/adminpanel"
export const superAdminRoute = "/superpanel"
export const docentiRoute = "/docentipanel"

export const Digits2 = (n: number) => {
    return n < 10 ? "0" + n : n
}

export const validateTime = (time: string) => {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])$/.test(time)
}

export const startEdit = (id: number) => {
    let entrataInput = document.getElementById("entrataInput_" + id),
    uscitaInput = document.getElementById("uscitaInput_" + id),
    entrataSpan = document.getElementById("entrataSpan_" + id),
    uscitaSpan = document.getElementById("uscitaSpan_" + id),
    editBtn = document.getElementById("editBtn_" + id),
    confirmBtn = document.getElementById("confirmBtn_" + id)

    hideAll()

    entrataInput.style.display = "block"
    uscitaInput.style.display = "block"
    confirmBtn.style.display = "inline-block"
    entrataSpan.style.display = "none"
    uscitaSpan.style.display = "none"
    editBtn.style.display = "none"
}

export const hideAll = () => {
    let entrataInputs = document.querySelectorAll("input[id^='entrataInput_']"),
    uscitaInputs = document.querySelectorAll("input[id^='uscitaInput_']"),
    entrataSpans = document.querySelectorAll("span[id^='entrataSpan_']"),
    uscitaSpans = document.querySelectorAll("span[id^='uscitaSpan_']"),
    confirmBtns = document.querySelectorAll("button[id^='confirmBtn_']"),
    editBtns = document.querySelectorAll("button[id^='editBtn_']")
    
    entrataInputs.forEach(e => {
        (e as HTMLElement).style.display = "none"
    })
    uscitaInputs.forEach(e => {
        (e as HTMLElement).style.display = "none"
    })
    confirmBtns.forEach(e => {
        (e as HTMLElement).style.display = "none"
    })
    entrataSpans.forEach(e => {
        (e as HTMLElement).style.display = "block"
    })
    uscitaSpans.forEach(e => {
        (e as HTMLElement).style.display = "block"
    })
    editBtns.forEach(e => {
        (e as HTMLElement).style.display = "inline-block"
    })
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

export const getDateDay = (d: string) => {
    let date = new Date(d)

    return Digits2(date.getDate()).toString()
}

export const getDateMonth = (d: string) => {
    let date = new Date(d)

    return Digits2(date.getMonth() + 1).toString()
}

export const getDateYear = (d: string) => {
    let date = new Date(d)

    return date.getFullYear().toString()
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

window.addEventListener("load", resizePopup)
window.addEventListener("resize", resizePopup)