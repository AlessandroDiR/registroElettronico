export class Cipher{
    private maximum = 65535

    public encode(msg: string, shift: number = -4){
        let finalMessage = ""
    
        if(shift < 0)
            shift = -shift
    
        for(let i = 0; i < msg.length; i++){
            let letter = msg[i],
            charInt = letter.charCodeAt(0),
            newInt = charInt + shift

            if(newInt > this.maximum)
                newInt = newInt - (this.maximum + 1)

            letter = String.fromCharCode(newInt)

            finalMessage += letter
        }
        
        return finalMessage
    }

    public decode(msg: string, shift: number = -4){
        let finalMessage = ""
    
        if(shift < 0)
            shift = -shift
    
        for(let i = 0; i < msg.length; i++){
            let letter = msg[i],
            charInt = letter.charCodeAt(0),
            newInt = charInt - shift

            if(newInt < 0)
                newInt = this.maximum + (newInt + 1)

            letter = String.fromCharCode(newInt)

            finalMessage += letter
        }
        
        return finalMessage
    }
}