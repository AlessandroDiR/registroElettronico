import React from "react"
import { Modal, message, DatePicker } from "antd"
import { routerHistory } from "../.."
import { siteUrl, formattaData, adminRoute } from "../../utilities"
import locale from "antd/es/date-picker/locale/it_IT"
import { askPassword } from "../AskConferma"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly dataNascita: string
    readonly cf: string
    readonly email: string
    readonly annoScolastico: number
}

export default class AddNewStudent extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            cf: "",
            annoScolastico: 1,
            email: "",
            dataNascita: ""
        }
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value.trim()

        this.setState({
            email: email
        })
    }
    
    changeData = (data: string) => {
        this.setState({
            dataNascita: data
        })
    }

    changeAnnoScolastico = (event: any) => {
        let annoS = event.target.value

        this.setState({
            annoScolastico: Number(annoS)
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value.trim()

        this.setState({
            cf: CF
        })
    }

    aggiungiStudente = () => {
        const { nome, cognome, dataNascita, cf, annoScolastico, email } = this.state

        if(nome.trim() === "" || cognome.trim() === "" || dataNascita === "" || cf === "" || !annoScolastico || email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(cf.length !== 16){
            Modal.error({
                title: "Errore!",
                content: "Codice Fiscale non valido."
            })

            return
        }

        let students = [{
            nome: nome.trim(),
            cognome: cognome.trim(),
            cf: cf,
            password: cf,
            email: email,
            annoFrequentazione: annoScolastico,
            dataNascita: formattaData(dataNascita, true),
            idCorso: this.props.corso
        }]

        askPassword(siteUrl+"/api/studenti", "post", {
            studenti: students
        }, (response: any) => {
            message.success("Studente creato con successo!")
            routerHistory.push(adminRoute+"/studenti")
        })

        // Axios.post(siteUrl+"/api/studenti", students).then(response => {
        //     message.success("Studente creato con successo!")
        //     routerHistory.push(adminRoute+"/studenti")
        // })

    }

    render(): JSX.Element{
        const { nome, cognome, cf, email } = this.state

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo studente</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input name="name" type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input name="surname" type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Anno frequentato</label>
                        <select name="anno" onChange={this.changeAnnoScolastico} className="custom-select">
                            <option value={1}>Primo anno</option>
                            <option value={2}>Secondo anno</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Data di nascita</label>
                        <DatePicker locale={locale} className="w-100 select-date" onChange={(_, d2) => this.changeData(d2)} format="DD-MM-YYYY" />
                    </div>
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input name="cf" type="text" className="form-control" maxLength={16} value={cf} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiStudente}>Aggiungi studente</button>
            </form>
        </div>
    }
}