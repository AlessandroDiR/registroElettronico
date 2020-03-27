import React from "react"
import { routerHistory } from "../.."
import { message, Modal } from "antd"
import { mountLogin, unmountLogin, siteUrl, logoUrl, adminRoute } from "../../utilities"
import Axios from "axios"
import { Cipher } from "../../models/Cipher"
import { isAdmin } from "../../models/IAdmin"
import ForgotPassword from "../ForgotPassword"
import Footer from "../Footer"

export interface IProps{}
export interface IState{
    readonly adminName: string
    readonly adminPsw: string
    readonly showForgot: boolean
}

export default class LoginTutor extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            adminName: "",
            adminPsw: "",
            showForgot: false
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

        Axios.post(siteUrl+"/api/coordinatori/logincoordinatore", {
            username: adminName.trim(),
            password: password
        }).then(response => {
            let data = response.data

            if(isAdmin(data)){
                sessionStorage.setItem("adminSession", JSON.stringify(data))
                routerHistory.push(adminRoute)
                message.success("Login effettuato con successo!")
            }
            else{
                Modal.error({
                    title: "Errore!",
                    content: "Username o Password errati!",
                    centered: true,
                    maskClosable: true
                })
            }
        })
    }

    switchForgot = () => {
        this.setState({
            showForgot: !this.state.showForgot
        })
    }

    render(): JSX.Element{
        const { adminName, adminPsw, showForgot } = this.state

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.tryLogin}>
                    <h3 className="d-inline-block">Accesso coordinatori</h3>
                    <img src={logoUrl} height="40" className="float-right logo" alt="logo" />

                    <div className="form-group">
                        <label className="text-secondary">Utente di accesso</label>
                        <input name="username" type="text" className="form-control" value={adminName} onChange={this.changeInputName} />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary">Password di accesso</label>
                        <input name="password" type="password" className="form-control" value={adminPsw} onChange={this.changeInputPassword} />
                    </div>

                    <input type="submit" value="Accedi" className="btn btn-lg btn-success w-100 text-uppercase"/>

                    <span className="link-blue u-hover d-block mt-3 text-center" onClick={this.switchForgot}>Hai dimenticato la password?</span>
                </form>

                <Footer />
            </div>

            <ForgotPassword show={showForgot} closeModal={this.switchForgot} />
        </div>
    }

}