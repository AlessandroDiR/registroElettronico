import React from "react"
import axios from "axios"
import { routerHistory } from "../.."
import { Admin } from "../../models/AdminModel"
import { message } from "antd"

export interface IProps{}
export interface IState{
    readonly adminName: string
    readonly adminPsw: string
}

export default class LoginComponent extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            adminName: "",
            adminPsw: ""
        }
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

    tryLogin = () => {
        const { adminName, adminPsw } = this.state

        if(adminName === "admin" && adminPsw === "admin"){
            localStorage.setItem("session", JSON.stringify(new Admin(1, "Luca", "Arcangeli")))
            routerHistory.push("/adminpanel/")
            message.success("Login effettuato con successo!")
        }

        /*************************************************/
        /* FARE RICHIESTA PER CONTROLLARE SE adminName   */
        /* a adminPsw CORRISPONDONO AD UN AMMINISTRATORE */
        /*************************************************/
    }

    render(): JSX.Element{
        const { adminName, adminPsw } = this.state

        return <div className="col-5 mx-auto" id="loginBlock">
            <form className="w-100" onSubmit={this.tryLogin}>
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