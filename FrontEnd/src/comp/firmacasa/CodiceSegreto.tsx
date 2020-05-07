import React from "react"
import { Modal, Icon } from "antd"
import { mountLogin, unmountLogin, siteUrl } from "../../utilities"
import Axios from "axios"
import { routerHistory } from "../.."
import { areStudent } from "../../models/IStudent"
import LogoCorso from "../LogoCorso"
import Footer from "../Footer"

export interface IProps{}
export interface IState{
    readonly codice: string
    readonly loading: boolean
}

export default class CodiceSegreto extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            codice: "",
            loading: false
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

        if(codice === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire il campo."
            })

            return
        }

        this.toggleLoading()

        Axios.post(siteUrl+"/api/firmaremota/accessoremoto", codice, {
            headers: {"Content-Type": "application/json"}
        }).then(response => {
            let data = response.data

            if(areStudent(data)){
                sessionStorage.removeItem("adminSession")
                sessionStorage.removeItem("superSession")
                sessionStorage.setItem("confermaCasa", JSON.stringify(data))
                routerHistory.push("/firmacasa")
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Il codice non corrisponde a nessun corso/classe, oppure è scaduto (chiedi al tuo coordinatore di cambiarlo).",
                    centered: true,
                    maskClosable: true
                })
            }

            this.toggleLoading()
        }).catch(_ => {
            Modal.error({
                title: "Errore!",
                content: "Il codice non è valido.",
                centered: true,
                maskClosable: true
            })

            this.toggleLoading()
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    render(): JSX.Element{
        const { codice, loading } = this.state

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaCodice}>
                    <h3 className="d-inline-block">Accesso firma da casa</h3>
                    <LogoCorso forLogin />

                    <div className="form-group">
                        <label className="text-secondary">Codice segreto</label>
                        <input name="username" type="text" className="form-control" value={codice} onChange={this.changeCodice} />
                    </div>

                    <p className="text-muted">Chiedi al tuo coordinatore il codice segreto per accedere alla firma da casa.</p>

                    <button type="submit" className="btn btn-lg btn-success w-100 text-uppercase" disabled={loading}>
                        {
                            loading && <Icon type="loading" className="mr-2 loadable-btn" spin />
                        }
                        Prosegui
                    </button>
                </form>

                <Footer />
            </div>
        </div>
    }

}