import React from "react"
import { Modal, Icon, Spin } from "antd";
import { routerHistory } from "../..";
import { getDateDay, getDateMonth, getDateYear, isValidData } from "../../utilities";
import { IDocente } from "../../models/IDocente";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly docente: IDocente
    readonly nome: string
    readonly cognome: string
    readonly gNascita: string
    readonly mNascita: string
    readonly aNascita: string
    readonly luogoNascita: string
    readonly CF: string
    readonly materia1: string
    readonly materia2: string
}

export default class EditDocente extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            docente: null,
            nome: "",
            cognome: "",
            gNascita: "",
            mNascita: "",
            aNascita: "",
            luogoNascita: "",
            CF: "",
            materia1: "",
            materia2: ""
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get("http://localhost:3000/reg/api?docente&id=" + id).then((response) => {
            let doc = response.data as IDocente

            this.setState({
                docente: doc,
                nome: doc.nome,
                cognome: doc.cognome,
                CF: doc.cf,
                materia1: doc.materia1,
                materia2: doc.materia2,
                gNascita: getDateDay(doc.dataNascita),
                mNascita: getDateMonth(doc.dataNascita),
                aNascita: getDateYear(doc.dataNascita),
                luogoNascita: doc.luogoNascita
            })
        })
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

    changeMateria1 = (event: any) => {
        let mat = event.target.value

        this.setState({
            materia1: mat
        })
    }

    changeMateria2 = (event: any) => {
        let mat = event.target.value

        this.setState({
            materia2: mat
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiDocente = () => {
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, materia1, materia2 } = this.state
        let giorno = Number(gNascita),
        mese = Number(mNascita),
        anno = Number(aNascita)

        if(nome === "" || cognome === "" || gNascita === "" || mNascita === "" || aNascita === "" || luogoNascita === "" || CF === "" || materia1 === "" || materia2 === ""){
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
                routerHistory.push("/adminpanel/docenti")
            }
        })

    }

    render(): JSX.Element{
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, materia1, materia2, docente } = this.state

        if(!docente){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di un docente</h3>

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
                        <label className="text-secondary">Luogo di nascita</label>
                        <input type="text" className="form-control" value={luogoNascita} onChange={this.changeLuogo} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Materia insegnata al primo anno</label>
                        <input type="text" className="form-control" value={materia1} onChange={this.changeMateria1} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Materia insegnata al secondo anno</label>
                        <input type="text" className="form-control" value={materia2} onChange={this.changeMateria2} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Modifica docente</button>
            </form>
        </div>
    }
}