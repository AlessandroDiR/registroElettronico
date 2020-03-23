import React from "react"
import { Cipher } from "../models/Cipher"
import Axios from "axios"
import { Modal, Icon } from "antd"
import { IAdmin } from "../models/IAdmin"
import { checkEnter } from "../utilities"

export const askPassword = (url: string, callType: string, body?: any, callback?: any, preAction?: any, customText?: string) => {
    let input: HTMLInputElement,
    cipher = new Cipher(),
    tutor = JSON.parse(sessionStorage.getItem("adminSession")) as IAdmin

    const sendForm = () => {

        if(input.value === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire il campo.",
                centered: true,
                maskClosable: true
            })
            
            return true
        }

        if(preAction)
            preAction()
            
        if(callType === "post"){
            let password = input.value

            if(tutor){
                body.authCoordinatore = {
                    idCoordinatore: tutor.idCoordinatore,
                    password: cipher.encode(password)
                }
            }else{
                body.password = password
            }

            Axios.post(url, body).then(callback).catch(_ => {
                Modal.error({
                    title: "Errore!",
                    content: "Password errata."
                })
            })
        }else if(callType === "put"){
            let password = input.value
            
            if(tutor){
                body.authCoordinatore = {
                    idCoordinatore: tutor.idCoordinatore,
                    password: cipher.encode(password)
                }
            }else{
                body.password = password
            }

            Axios.put(url, body).then(callback).catch(_ => {
                Modal.error({
                    title: "Errore!",
                    content: "Password errata."
                })
            })
        }
    }

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