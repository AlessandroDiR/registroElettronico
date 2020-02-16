import React from "react"
import axios from "axios"
import { IMessage, genericError } from "../models/IMessage"
import { siteUrl } from "../utilities"
import { routerHistory } from ".."
import { Divider, Tooltip } from "antd"

export interface IProps{}
export interface IState{
    readonly code: string
    readonly popup: IMessage
}

export default class FirmaComponent extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            code: "",
            popup: genericError
        }
    }

    changeCode = (event: any) => {
        let code = event.target.value

        this.setState({
            code: code
        })

        this.tryToLog(code)
    }

    tryToLog = (code: string) => {
        axios.get(siteUrl + "/api/studenti/firma/" + code).then((response) => {
            this.setState({
                popup: response.data as IMessage
            })

            this.showMessagePopup()
        }).catch((err) => {
            this.setState({
                popup: genericError
            })

            this.showMessagePopup()
        })
    }

    showMessagePopup = () => {
        let popup = document.getElementById("popup"),
        input = document.getElementById("mainInput") as HTMLInputElement

        if(!input && !popup) return false

        popup.classList.add("show")
        input.setAttribute("disabled", "disabled")

        setTimeout(() => {
            popup.classList.remove("show")
            input.value = ""
            input.removeAttribute("disabled")
            input.focus()
        }, this.state.popup.time)
    }

    cambiaCorso = () => {
        sessionStorage.removeItem("corso")
        sessionStorage.removeItem("classe")

        routerHistory.push("/")
    }

    render(): JSX.Element{
        const { popup } = this.state

        return <div className="col-9" id="mainBlock">
            <div className="text-center w-100">
                <h2 className="text-center my-3 font-weight-normal">Scannerizza il codice</h2>
                <input autoFocus type="password" className="form-control text-center mx-auto shadow-sm font-weight-normal" value={this.state.code} onChange={this.changeCode} maxLength={24} id="mainInput" />

                <div className="top-info">
                        {sessionStorage.getItem("corso")}
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

            <div id="popup" className="col-9">
                <div className="w-100">
                    <i className={"fal fa-fw fa-lg fa-6x " + popup.icon} style={{ color: popup.iconColor}}></i>
                    <h2 className="mt-5">{popup.title}</h2>
                    <div className="mt-2">{popup.message}</div>
                </div>
            </div>
        </div>
    }
}