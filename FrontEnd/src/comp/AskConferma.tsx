import React from "react"
import { Cipher } from "../models/Cipher"
import Axios from "axios"
import { Modal } from "antd"
import { IAdmin } from "../models/IAdmin"

export const askPassword = (url: string, callType: string, callback?: any, body?: any) => {
    let input: HTMLInputElement,
    cipher = new Cipher(),
    tutor = JSON.parse(sessionStorage.getItem("adminSession")) as IAdmin

    Modal.confirm({
        title: "Prima di procedere...",
        content: <div style={{ marginLeft: -38 }}>
            <div className="form-group mb-0">
                <label className="text-secondary">Password del tutor</label>
                <input type="password" ref={r => input = r} className="form-control" />
            </div>
        </div>,
        okText: "Conferma identità",
        cancelText: "Annulla",
        onOk: () => {
            if(callType === "get"){
                Axios.get(url).then(callback)
            }else if(callType === "post"){
                body.password = cipher.encode(input.value)
                body.idCoordinatore = tutor.idCoordinatore

                Axios.post(url, body).then(callback)
            }else if(callType === "put"){
                body.password = cipher.encode(input.value)
                body.idCoordinatore = tutor.idCoordinatore

                Axios.put(url, body).then(callback)
            }
        }
    })
}