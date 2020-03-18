import React from "react"
import { Modal } from "antd"
import { mountLogin, unmountLogin, siteUrl } from "../../utilities"
import Axios from "axios"
import { routerHistory } from "../.."
import { areStudent } from "../../models/IStudent"
import LogoCorso from "../LogoCorso"

export interface IProps{}
export interface IState{
    readonly codice: string
}

export default class CodiceSegreto extends React.PureComponent<IProps, IState>{
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

    changeCodice = (event: any) => {
        let code = event.target.value

        this.setState({
            codice: code.trim()
        })
    }

    inviaCodice = (e: any) => {
        e.preventDefault()

        const { codice } = this.state

        Axios.post(siteUrl+"/api/firmadacasa", {
            codice: codice
        }).then(response => {
            let data = response.data

            if(areStudent(data)){
                sessionStorage.setItem("confermaCasa", JSON.stringify(data))
                routerHistory.push("/firmacasa")
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Il codice non corrisponde a nessun corso/classe.",
                    centered: true,
                    maskClosable: true
                })
            }
        })
    }

    render(): JSX.Element{
        const { codice } = this.state

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaCodice}>
                <h3 className="d-inline-block">Accesso firma da casa</h3>
                <LogoCorso forLogin={true} />

                <div className="form-group">
                    <label className="text-secondary">Codice segreto</label>
                    <input name="username" type="text" className="form-control" value={codice} onChange={this.changeCodice} />
                </div>

                <p className="text-muted">Chiedi al tuo coordinatore il codice segreto per accedere alla firma da casa.</p>

                <input type="submit" value="Prosegui" className="btn btn-lg btn-success w-100 text-uppercase"/>
            </form>
        </div>
    }

}