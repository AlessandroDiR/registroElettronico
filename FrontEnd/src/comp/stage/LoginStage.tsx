import React from "react"
import { routerHistory } from "../.."
import { message, Modal } from "antd"
import { mountLogin, unmountLogin, siteUrl, logoUrl, stageRoute } from "../../utilities"
import Axios from "axios"
import Footer from "../Footer"
import { isAccessStudent } from "../../models/IStudent"

export interface IProps{}
export interface IState{
    readonly userEmail: string
    readonly userCode: string
    readonly isExisting: boolean
}

export default class LoginStage extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            userEmail: "",
            userCode: "",
            isExisting: false
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

    cancelAction = () => {
        this.setState({
            isExisting: false
        })
    }

    tryAccess = (e: any) => {
        e.preventDefault()

        const { userEmail, userCode, isExisting } = this.state

        if(!isExisting){
            Axios.post(siteUrl+"/api/studenti/checkemaillogin", {
                email: userEmail
            }).then(response => {
                let exists = response.data as boolean

                if(exists){
                    this.setState({
                        isExisting: exists
                    })
                }else{
                    Modal.error({
                        title: "Errore!",
                        content: "L'e-mail inserita non corrisponde a nessuno studente."
                    })
                }
            })
        }else{
            Axios.post(siteUrl+"/api/studenti/loginstudente", {
                email: userEmail,
                password: userCode
            }).then(response => {
                let data = response.data

                if(isAccessStudent(data)){
                    sessionStorage.setItem("stageSession", JSON.stringify(data))
                    routerHistory.push(stageRoute)
                    message.success("Login effettuato con successo!")
                }else{
                    Modal.error({
                        title: "Errore!",
                        content: "E-mail o codice errati.",
                        centered: true,
                        maskClosable: true
                    })
                }
            })
        }
    }

    render(): JSX.Element{
        const { userCode, userEmail, isExisting } = this.state

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.tryAccess}>
                    <h3 className="d-inline-block">Accesso studenti</h3>
                    <img src={logoUrl} height="40" className="float-right logo" alt="logo" />

                    <div className="form-group">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="email" className="form-control" value={userEmail} onChange={this.changeMail} />
                    </div>

                    {
                        isExisting && <div className="form-group">
                            <label className="text-secondary">Codice ricevuto per e-mail</label>
                            <input name="code" type="password" className="form-control" value={userCode} onChange={this.changeCode} />
                        </div>
                    }

                    
                    <div className="row">
                        {
                            isExisting && <div className="pr-1 col-6">
                                <input type="button" value="Annulla" className="btn btn-lg btn-link text-danger w-100 text-uppercase" onClick={this.cancelAction} />
                            </div>
                        }
                        <div className={isExisting ? "pl-1 col" : "col"}>
                            <input type="submit" value={isExisting ? "Accedi" : "Prosegui"} className="btn btn-lg btn-success w-100 text-uppercase"/>
                        </div>
                    </div>
                </form>

                <Footer />
            </div>
        </div>
    }

}