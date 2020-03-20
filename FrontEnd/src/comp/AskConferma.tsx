import React from "react"
import { Cipher } from "../models/Cipher"
import Axios from "axios"
import { Modal, Icon } from "antd"
import { IAdmin } from "../models/IAdmin"

export const askPassword = (url: string, callType: string, body?: any, callback?: any, preAction?: any) => {
    let input: HTMLInputElement,
    cipher = new Cipher(),
    tutor = JSON.parse(sessionStorage.getItem("adminSession")) as IAdmin

    const sendForm = () => {
        if(preAction)
            preAction()
            
        if(callType === "post"){
            body.password = cipher.encode(input.value)

            if(tutor)
                body.idCoordinatore = tutor.idCoordinatore

            Axios.post(url, body).then(callback)
        }else if(callType === "put"){
            body.password = cipher.encode(input.value)
            
            if(tutor)
                body.idCoordinatore = tutor.idCoordinatore

            Axios.put(url, body).then(callback)
        }
    }

    let modal = Modal.confirm({
        title: "Prima di procedere...",
        content: <div style={{ marginLeft: -38 }}>
            <div className="form-group mb-0">
                <label className="text-secondary">Inserisci la tua password per confermare l'identità</label>
                <input type="password" ref={r => input = r} className="form-control" onKeyUp={(e) => {
                    if(e.keyCode === 13){
                        sendForm()
                        modal.destroy()
                    }
                }} />
            </div>
        </div>,
        okText: "Conferma identità",
        cancelText: "Annulla",
        onOk: sendForm,
        icon: <Icon type="lock" style={{ color: "var(--danger)" }} />,
    })
}