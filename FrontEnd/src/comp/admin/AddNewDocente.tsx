import React from "react"
import { Modal, message } from "antd"
import { routerHistory } from "../.."
import { isValidData, siteUrl } from "../../utilities"
import Axios from "axios"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly gNascita: string
    readonly mNascita: string
    readonly aNascita: string
    readonly CF: string
    readonly email: string
}

export default class AddNewDocente extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            gNascita: "",
            mNascita: "",
            aNascita: "",
            CF: "",
            email: ""
        }
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value

        this.setState({
            email: email
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeGiorno = (event: any) => {
        let giorno = event.target.value

        this.setState({
            gNascita: giorno
        })
    }

    changeMese = (event: any) => {
        let mese = event.target.value

        this.setState({
            mNascita: mese
        })
    }

    changeAnno = (event: any) => {
        let anno = event.target.value

        this.setState({
            aNascita: anno
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiDocente = () => {
        const { nome, cognome, gNascita, mNascita, aNascita, CF, email } = this.state
        let giorno = parseInt(gNascita),
        mese = parseInt(mNascita),
        anno = parseInt(aNascita)

        if(nome === "" || cognome === "" || gNascita === "" || mNascita === "" || aNascita === "" || CF === "" || email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(!isValidData(giorno, mese, anno)){
            Modal.error({
                title: "Errore!",
                content: "Data di nascita non valida."
            })

            return
        }

        if(CF.length !== 16){
            Modal.error({
                title: "Errore!",
                content: "Codice Fiscale non valido."
            })

            return
        }

        Axios.post(siteUrl+"/api/docenti", {
            nome: nome,
            cognome: cognome,
            cf: CF,
            password: CF,
            email: email,
            dataNascita: `${aNascita}-${mNascita}-${gNascita}`,
            tenere: [],
            insegnare: []
        }).then(_ => {
            message.success("Docente creato con successo!")
            routerHistory.push("/adminpanel/docenti")
        })

    }

    render(): JSX.Element{
        const { nome, cognome, gNascita, mNascita, aNascita, CF, email } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo docente</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Giorno nascita</label>
                        <input type="text" className="form-control" maxLength={2} value={gNascita} onChange={this.changeGiorno} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Mese nascita</label>
                        <input type="text" className="form-control" maxLength={2} value={mNascita} onChange={this.changeMese} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Anno nascita</label>
                        <input type="text" className="form-control" maxLength={4} value={aNascita} onChange={this.changeAnno} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Aggiungi docente</button>
            </form>
        </div>
    }
}