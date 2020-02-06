import React from "react"
import { Modal, Icon, Spin } from "antd";
import { routerHistory } from "../..";
import { getDateDay, getDateMonth, getDateYear, isValidData, siteUrl } from "../../utilities";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { IStudent } from "../../models/IStudent";

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
    readonly gNascita: string
    readonly mNascita: string
    readonly aNascita: string
    readonly luogoNascita: string
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
            gNascita: "",
            mNascita: "",
            aNascita: "",
            luogoNascita: "",
            CF: "",
            email: ""
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get(siteUrl+"/reg/api?studente&id=" + id).then((response) => {
            let stu = response.data as IStudent

            this.setState({
                studente: stu,
                nome: stu.nome,
                cognome: stu.cognome,
                CF: stu.cf,
                gNascita: getDateDay(stu.dataNascita),
                mNascita: getDateMonth(stu.dataNascita),
                aNascita: getDateYear(stu.dataNascita),
                luogoNascita: stu.luogoNascita,
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
        let mail = event.target.value

        this.setState({
            email: mail
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

    changeLuogo = (event: any) => {
        let luogo = event.target.value

        this.setState({
            luogoNascita: luogo
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiDocente = () => {
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, email } = this.state
        let giorno = Number(gNascita),
        mese = Number(mNascita),
        anno = Number(aNascita)

        if(nome === "" || cognome === "" || gNascita === "" || mNascita === "" || aNascita === "" || luogoNascita === "" || CF === "" || email === ""){
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

        /******************************************/
        /* MODIFICA DOCENTE E POI MOSTRARE MODAL */
        /*****************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Docente modificato con successo.",
            onOk: () => {
                routerHistory.push("/adminpanel/studenti")
            }
        })

    }

    render(): JSX.Element{
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, studente, email } = this.state

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
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input type="email" className="form-control" value={email} onChange={this.changeEmail} />
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
                        <label className="text-secondary">Luogo di nascita</label>
                        <input type="text" className="form-control" value={luogoNascita} onChange={this.changeLuogo} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Modifica studente</button>
            </form>
        </div>
    }
}