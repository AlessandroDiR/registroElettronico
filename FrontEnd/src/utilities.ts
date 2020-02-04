export const Digits2 = (n: number) => {
    return n < 10 ? "0" + n : n
}

export const isValidMeseGiorno = (g: number, m: number, a: number) => {

    if(m < 0 || g < 0 || m > 12)
        return false

    switch(m){
        case 4 || 6 || 9 || 11:
            if(g > 30)
                return false
            break
        case 2:
            if((a % 400 === 0 || a % 4 === 0) && g > 29)
                return false
            else if(g > 28 && a % 400 !== 0 && a % 4 !== 0)
                return false
            break
        default:
            if(g > 31)
                return false
    }

    return true
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

export const formattaData = (d: string) => {
    let date = new Date(d)

    return Digits2(date.getDate()) + "-" + Digits2(date.getMonth() + 1) + "-" + date.getFullYear()
}

export const getDateDay = (d: string) => {
    let date = new Date(d)

    return Digits2(date.getDate()).toString()
}

export const getDateMonth = (d: string) => {
    let date = new Date(d)

    return Digits2(date.getMonth()).toString()
}

export const getDateYear = (d: string) => {
    let date = new Date(d)

    return date.getFullYear().toString()
}

export const isValidData = (g: number, m: number, a: number) => {
    if(isNaN(g) || isNaN(m) || isNaN(a) || String(a).length !== 4 || !isValidMeseGiorno(g, m, a))
        return false

    return true
}