import React from "react"
import { routerHistory } from "../.."
import { message, Modal } from "antd"
import { mountLogin, unmountLogin, siteUrl } from "../../utilities"
import { Cipher } from "../../models/Cipher"
import Axios from "axios"
import { isAdminDocente } from "../../models/IAdminDocente"

export interface IProps{}
export interface IState{
    readonly adminName: string
    readonly adminPsw: string
}

export default class LoginDocenti extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            adminName: "",
            adminPsw: ""
        }
    }

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    changeInputName = (event: any) => {
        let name = event.target.value

        this.setState({
            adminName: name
        })
    }

    changeInputPassword = (event: any) => {
        let psw = event.target.value

        this.setState({
            adminPsw: psw
        })
    }

    tryLogin = (e: any) => {
        e.preventDefault()
        
        const { adminName, adminPsw } = this.state
        let cipher = new Cipher(),
        password = cipher.encode(adminPsw)

        Axios.post(siteUrl+"/api/logindocente", {
            username: adminName,
            password: password
        }).then(response => {
            let data = response.data

            if(isAdminDocente(data)){
                sessionStorage.setItem("docenteSession", JSON.stringify(data))
                routerHistory.push("/docentipanel/")
                message.success("Login effettuato con successo!")
            }
            else{
                Modal.error({
                    title: "Errore!",
                    content: "Username o Password errati!"
                })
            }
        })
    }

    render(): JSX.Element{
        const { adminName, adminPsw } = this.state

        return <div className="col-5 mx-auto" id="loginBlock">
            <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.tryLogin}>
                <h3 className="text-center">Effettua il login</h3>

                <div className="form-group">
                    <label className="text-secondary">Utente di accesso</label>
                    <input type="text" className="form-control" value={adminName} onChange={this.changeInputName} />
                </div>

                <div className="form-group">
                    <label className="text-secondary">Password di accesso</label>
                    <input type="password" className="form-control" value={adminPsw} onChange={this.changeInputPassword} />
                </div>

                <input type="submit" value="Accedi" className="btn btn-lg btn-success w-100 text-uppercase"/>
            </form>
        </div>
    }

}