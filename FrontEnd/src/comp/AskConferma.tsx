import React from "react"
import Axios from "axios"
import { Modal, Icon } from "antd"
import { IAdmin } from "../models/IAdmin"
import { checkEnter } from "../utilities"

export const askPassword = (url: string, callType: string, body?: any, callback?: any, preAction?: any, customText?: string) => {
    let input: HTMLInputElement,
    tutor = JSON.parse(sessionStorage.getItem("adminSession")) as IAdmin,
    admin = JSON.parse(sessionStorage.getItem("superSession")) as IAdmin

    const sendForm = () => {

        if(preAction)
            preAction()

        if(admin){
            body.authAdmin = {
                idAdmin: admin.idAmministratore,
                password: admin.password
            }
        }
        else if(tutor){
            body.authCoordinatore = {
                idCoordinatore: tutor.idCoordinatore,
                password: tutor.password
            }
        }else{
            if(input.value === ""){
                Modal.error({
                    title: "Errore!",
                    content: "Riempire il campo.",
                    centered: true,
                    maskClosable: true
                })
                
                return true
            }
            
            body.password = input.value
        }

        if(callType === "post"){
            Axios.post(url, body).then(callback).catch(_ => {
                Modal.error({
                    title: "Errore!",
                    content: "Password errata."
                })
            })
        }else if(callType === "put"){
            Axios.put(url, body).then(callback).catch(_ => {
                Modal.error({
                    title: "Errore!",
                    content: "Password errata."
                })
            })
        }
    }

    if(tutor || admin){
        sendForm()
    }else{
        let modal = Modal.confirm({
            title: "Prima di procedere...",
            content: <div style={{ marginLeft: -38 }}>
                <div className="form-group mb-0">
                    <label className="text-secondary">
                        {customText ? customText : "Inserisci la tua password per confermare l'identità"}
                    </label>
                    <input type="password" ref={r => input = r} className="form-control" onKeyUp={(e) => checkEnter(e, () => {
                        if(!sendForm())
                            modal.destroy()
                    })} />
                </div>
            </div>,
            okText: "Conferma identità",
            cancelText: "Annulla",
            onOk: sendForm,
            icon: <Icon type="lock" style={{ color: "var(--danger)" }} />,
            centered: true
        })

        setTimeout(() => {
            input.focus()
        }, 300)
    }
}