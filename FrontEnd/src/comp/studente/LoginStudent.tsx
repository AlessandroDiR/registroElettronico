import React from "react"
import { routerHistory } from "../.."
import { message, Modal } from "antd"
import { mountLogin, unmountLogin, siteUrl, logoUrl, studentRoute } from "../../utilities"
import Axios from "axios"
import Footer from "../Footer"
import { isAccessStudent } from "../../models/IStudent"
import ForgotPassword from "../ForgotPassword"
import { Cipher } from "../../models/Cipher"

export interface IProps{}
export interface IState{
    readonly userEmail: string
    readonly userCode: string
    readonly showForgot: boolean
}

export default class LoginStudent extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            userEmail: "",
            userCode: "",
            showForgot: false
        }
    }

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    changeMail = (event: any) => {
        let email = event.target.value.trim()

        this.setState({
            userEmail: email
        })
    }

    changeCode = (event: any) => {
        let code = event.target.value

        this.setState({
            userCode: code
        })
    }

    switchForgot = () => {
        this.setState({
            showForgot: !this.state.showForgot
        })
    }

    tryAccess = (e: any) => {
        e.preventDefault()

        const { userEmail, userCode } = this.state

        let cipher = new Cipher(),
        password = cipher.encode(userCode)

        Axios.post(siteUrl+"/api/studenti/loginstudente", {
            email: userEmail,
            password
        }).then(response => {
            let data = response.data

            if(isAccessStudent(data)){
                sessionStorage.setItem("studentSession", JSON.stringify(data))
                routerHistory.push(studentRoute)
                message.success("Login effettuato con successo!")
            }else{
                Modal.error({
                    title: "Errore!",
                    content: response.data,
                    centered: true,
                    maskClosable: true
                })
            }
        })
    }

    render(): JSX.Element{
        const { userCode, userEmail, showForgot } = this.state

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.tryAccess}>
                    <h3 className="d-inline-block">Accesso studenti</h3>
                    <img src={logoUrl} height="40" className="float-right logo" alt="logo" />

                    <div className="form-group">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="email" className="form-control" value={userEmail} onChange={this.changeMail} />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary">Password</label>
                        <input name="code" type="password" className="form-control" value={userCode} onChange={this.changeCode} />
                    </div>

                    <input type="submit" value="Accedi" className="btn btn-lg btn-success w-100 text-uppercase"/>

                    <span className="link-blue u-hover d-block mt-3 text-center" onClick={this.switchForgot}>Hai dimenticato la password?</span>
                </form>

                <Footer />

                <ForgotPassword show={showForgot} closeModal={this.switchForgot} forStudent />
            </div>
        </div>
    }

}