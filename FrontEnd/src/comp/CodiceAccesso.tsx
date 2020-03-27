import React from "react"
import { mountLogin, unmountLogin, siteUrl } from "../utilities"
import { routerHistory } from ".."
import Axios from "axios"
import { Modal } from "antd"
import Footer from "./Footer"

export interface IProps{
    readonly idCorso: number
}
export interface IState{
    readonly codice: string
}
export default class CodiceAccesso extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            codice: ""
        }
    }

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    cambiaCodice = (e: any) => {
        let codice = e.target.value

        this.setState({
            codice: codice
        })
    }

    cambiaScelta = () => {
        sessionStorage.removeItem("corso")
        sessionStorage.removeItem("classe")

        routerHistory.push("/")
    }

    inviaCodice = (e: any) => {
        e.preventDefault()

        if(this.state.codice === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire il campo."
            })

            return
        }

        Axios.post(siteUrl+"/api/firma/accedi", {
            idCorso: this.props.idCorso,
            codice: this.state.codice
        }).then(response => {

            if(response.data.trim() === "success"){
                sessionStorage.setItem("confermaTutor", "true")
                routerHistory.push("/")
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Codice non valido."
                })
            }
        })
    }

    render(): JSX.Element{
        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaCodice}>
                    <h3 className="text-center">Conferma del coordinatore</h3>

                    <div className="form-group">
                        <label className="text-secondary">Codice di conferma</label>
                        <input name="codice" type="password" className="form-control" value={this.state.codice} onChange={this.cambiaCodice} />
                    </div>

                    <div className="row">
                        <div className="pr-1 col-6">
                            <input type="button" value="Annulla scelta" className="btn btn-lg btn-link text-danger w-100 text-uppercase" onClick={this.cambiaScelta} />
                        </div>
                        <div className="pl-1 col">
                            <input type="submit" value="Prosegui" className="btn btn-lg btn-success w-100 text-uppercase"/>
                        </div>
                    </div>
                </form>

                <Footer />
            </div>
        </div>

    }
}