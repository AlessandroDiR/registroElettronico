import React from "react"
import axios from "axios"
import { IMessage, genericError } from "../models/IMessage"
import { siteUrl, resizePopup } from "../utilities"
import { routerHistory } from ".."
import { Divider, Tooltip, Spin, Icon } from "antd"
import { ICorso } from "../models/ICorso"
import Axios from "axios"
import { Cipher } from "../models/Cipher"

export interface IProps{}
export interface IState{
    readonly code: string
    readonly popup: IMessage
    readonly corso: ICorso
}

export default class Firma extends React.PureComponent<IProps, IState>{
    maxLength = 16

    constructor(props: IProps){
        super(props)

        this.state = {
            code: "",
            popup: genericError,
            corso: null
        }
    }
    
    componentDidMount = () => {
        let id = parseInt(sessionStorage.getItem("corso"))

        Axios.get(siteUrl+"/api/corsi/"+id).then(response => {
            let corso = response.data as ICorso

            this.setState({
                corso: corso
            })
        })

        resizePopup()
    }

    changeCode = (event: any) => {
        let code = event.target.value

        this.setState({
            code: code
        })

        this.tryToLog(code)
    }

    tryToLog = (code: string) => {
        if(code.length < this.maxLength) return false

        this.switchInput(true)

        let idCorso = parseInt(sessionStorage.getItem("corso")),
        anno = parseInt(sessionStorage.getItem("classe")),
        cipher = new Cipher(),
        codice = cipher.encode(code)
        
        axios.post(siteUrl + "/api/firma", {
            code: codice,
            idCorso: idCorso,
            anno: anno
        }).then((response) => {
            this.setState({
                popup: response.data as IMessage
            })

            this.showMessagePopup()
        }).catch((_) => {
            this.setState({
                popup: genericError
            })

            this.showMessagePopup()
        })
    }

    switchInput = (disable: boolean) => {
        let input = document.getElementById("mainInput") as HTMLInputElement

        if(!input) return

        if(disable)
            input.setAttribute("disabled", "disabled")
        else{
            input.value = ""
            input.removeAttribute("disabled")
            input.focus()
        }
    }

    showMessagePopup = () => {
        let popup = document.getElementById("popup")

        if(!popup) return

        popup.classList.add("show")

        setTimeout(() => {
            popup.classList.remove("show")
            this.switchInput(false)
        }, this.state.popup.time)
    }

    cambiaCorso = () => {
        sessionStorage.removeItem("corso")
        sessionStorage.removeItem("classe")

        routerHistory.push("/")
    }

    render(): JSX.Element{
        const { popup, corso } = this.state
        let icon = <Icon type="loading" spin />

        return <div className="col" id="mainBlock">
            <div className="text-center w-100">
                <h2 className="text-center my-3 font-weight-normal">Scannerizza il codice</h2>
                <input autoFocus type="password" className="form-control text-center mx-auto shadow-sm font-weight-normal" value={this.state.code} onChange={this.changeCode} maxLength={this.maxLength} id="mainInput" />

                <div className="top-info">
                    {
                        corso ? corso.nome : <Spin indicator={icon} />
                    }
                        <Divider type="vertical" style={{ height: 20 }} />
                    {
                        parseInt(sessionStorage.getItem("classe")) === 1 ? "Primo anno" : "Secondo anno"
                    }
                        <Divider type="vertical" style={{ height: 20 }} />
                    <Tooltip placement="bottomRight" title="Cambia il corso o la classe per firmare">
                        <button type="button" className="btn btn-sm btn-blue" onClick={this.cambiaCorso}>
                            <i className="far fa-repeat-alt fa-fw mr-1"></i>
                            Cambia
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div id="popup">
                <div className="w-100">
                    <i className={"fal fa-fw fa-lg fa-6x " + popup.icon} style={{ color: popup.iconColor}}></i>
                    <h2 className="mt-5">{popup.title}</h2>
                    <div className="mt-2">{popup.message}</div>
                </div>
            </div>
        </div>
    }
}