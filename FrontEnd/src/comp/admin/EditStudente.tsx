import React from "react"
import { Modal, Icon, Spin, message, DatePicker } from "antd"
import { routerHistory } from "../.."
import { siteUrl, formattaData, formatItalian, adminRoute } from "../../utilities"
import Axios from "axios"
import { RouteComponentProps } from "react-router-dom"
import { IStudent } from "../../models/IStudent"
import locale from "antd/es/date-picker/locale/it_IT"
import moment from "moment"
import { askPassword } from "../AskConferma"

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly studente: IStudent
    readonly nome: string
    readonly cognome: string
    readonly dataNascita: string
    readonly CF: string
    readonly email: string
    readonly loading: boolean
}

export default class EditStudente extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            studente: null,
            nome: "",
            cognome: "",
            dataNascita: "",
            CF: "",
            email: "",
            loading: false
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push(adminRoute)

        Axios.get(siteUrl+"/api/studenti/getstudentibyid/" + id).then(response => {
            let stu = response.data as IStudent

            this.setState({
                studente: stu,
                nome: stu.nome,
                cognome: stu.cognome,
                CF: stu.cf,
                dataNascita: formatItalian(stu.dataNascita),
                email: stu.email
            })
        })
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value.trim()

        this.setState({
            email
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome
        })
    }

    changeData = (data: string) => {
        this.setState({
            dataNascita: data
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value.trim()

        this.setState({
            CF
        })
    }

    modificaStudente = (e: any) => {
        e.preventDefault()
        
        const { nome, cognome, dataNascita, CF, email, studente } = this.state

        if(nome.trim() === "" || cognome.trim() === "" || dataNascita === "" || CF === "" || email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
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

        this.toggleLoading()

        askPassword(siteUrl+"/api/studenti/" + studente.idStudente, "put", {
            studente: {
                idStudente: studente.idStudente,
                nome: nome.trim(),
                cognome: cognome.trim(),
                email,
                cf: CF,
                idCorso: this.props.corso,
                annoFrequentazione: studente.annoFrequentazione,
                dataNascita: formattaData(dataNascita, true),
                ritirato: studente.ritirato,
                promosso: studente.promosso
            }
        }, (_: any) => {
            this.toggleLoading()
            message.success("Studente modificato con successo!")
            routerHistory.push(adminRoute+"/studenti")
        })
        
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    render(): JSX.Element{
        const { nome, cognome, dataNascita, CF, studente, email, loading } = this.state

        if(!studente){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di uno studente</h3>

            <form onSubmit={this.modificaStudente}>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input name="name" type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input name="surname" type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Data di nascita</label>
                        <DatePicker locale={locale} className="w-100 select-date" onChange={(_, d2) => this.changeData(d2)} format="DD-MM-YYYY" defaultValue={moment(dataNascita, "DD-MM-YYYY")} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input name="cf" type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="submit" className="btn btn-success text-uppercase w-100" disabled={loading}>
                    {
                        loading && <Icon type="loading" className="mr-2 loadable-btn" spin />
                    }
                    Modifica studente
                </button>
            </form>
        </div>
    }
}