import React from "react"
import { Modal, Icon, Spin, message, DatePicker } from "antd";
import { routerHistory } from "../..";
import { siteUrl, formattaData, formatItalian } from "../../utilities";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { IStudent } from "../../models/IStudent";
import locale from 'antd/es/date-picker/locale/it_IT';
import moment from 'moment';

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
            email: ""
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get(siteUrl+"/api/studenti/getstudentibyid/" + id).then((response) => {
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

    changeData = (data: string) => {
        this.setState({
            dataNascita: data
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    modificaStudente = () => {
        const { nome, cognome, dataNascita, CF, email } = this.state

        if(nome === "" || cognome === "" || dataNascita === "" || CF === "" || email === ""){
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

        Axios.put(siteUrl+"/api/studenti/" + this.state.studente.idStudente, {
            idStudente: this.state.studente.idStudente,
            nome: nome,
            cognome: cognome,
            email: email,
            password: this.state.studente.password,
            cf: CF,
            idCorso: this.props.corso,
            annoFrequentazione: this.state.studente.annoFrequentazione,
            dataNascita: formattaData(dataNascita),
            ritirato: this.state.studente.ritirato
        }).then(response => {
            message.success("Studente modificato con successo!")
            routerHistory.push("/adminpanel/studenti")

        })
        
    }

    render(): JSX.Element{
        const { nome, cognome, dataNascita, CF, studente, email } = this.state

        if(!studente){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di uno studente</h3>

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
                        <label className="text-secondary">Data di nascita</label>
                        <DatePicker locale={locale} className="w-100 select-date" onChange={(_, d2) => this.changeData(d2)} format="DD-MM-YYYY" defaultValue={moment(dataNascita, 'DD-MM-YYYY')} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.modificaStudente}>Modifica studente</button>
            </form>
        </div>
    }
}