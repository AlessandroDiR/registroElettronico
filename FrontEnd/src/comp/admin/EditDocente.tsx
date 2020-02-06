import React from "react"
import { Modal, Icon, Spin, Checkbox } from "antd";
import { routerHistory } from "../..";
import { getDateDay, getDateMonth, getDateYear, isValidData, siteUrl } from "../../utilities";
import { IDocente } from "../../models/IDocente";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { IMateria } from "../../models/IMateria";
import { ICorso } from "../../models/ICorso";

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
    readonly email: string
    readonly materie: IMateria[]
    readonly corsi: ICorso[]
    readonly materieSel: number[]
    readonly corsiSel: number[] 
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
            email: "",
            materie: [],
            materieSel: [],
            corsi: [],
            corsiSel: []
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get(siteUrl+"/api/docenti/GetDocentiById/" + id).then((response) => {
            let doc = response.data as IDocente

            this.setState({
                docente: doc,
                nome: doc.nome,
                cognome: doc.cognome,
                CF: doc.cf,
                gNascita: getDateDay(doc.dataNascita),
                mNascita: getDateMonth(doc.dataNascita),
                aNascita: getDateYear(doc.dataNascita),
                luogoNascita: doc.luogoNascita,
                email: doc.email
            })
        })
        
        Axios.get(siteUrl+"/api/materie").then((response) => {
            let materie = response.data as IMateria[]
            
            this.setState({
                materie: materie
            })
        })

        Axios.get(siteUrl+"/api/corsi").then((response) => {
            let corsi = response.data as ICorso[]
            
            this.setState({
                corsi: corsi
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

        // const params = new URLSearchParams();

        // params.append('nomeParametro', 'valoreParametro'); // per ogni parametro da passare
          
        // Axios.post("http://mygraphic.altervista.org/reg/put", params).then((response) => {
        //     if(Boolean(response.data) === true)
        //     Modal.success({
        //         title: "Complimenti!",
        //         content: "Docente modificato con successo.",
        //         onOk: () => {
        //             routerHistory.push("/adminpanel/docenti")
        //         }
        //     })
        // })

    }

    switchMateria = (materiaId: number) => {
        let find = this.state.materieSel.find(m => m === materiaId),
        newList = find ? this.state.materieSel.filter(m => m !== materiaId) : this.state.materieSel.concat(materiaId)

        this.setState({
            materieSel: newList
        })
    }

    switchCorso = (corsoId: number) => {
        let find = this.state.corsiSel.find(m => m === corsoId),
        newList = find ? this.state.corsiSel.filter(m => m !== corsoId) : this.state.corsiSel.concat(corsoId)

        this.setState({
            corsiSel: newList
        })
    }

    render(): JSX.Element{
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, docente, email, materie, materieSel, corsi, corsiSel } = this.state

        if(!docente || !materie.length || !corsi.length){
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

                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Materie insegnate dal docente</label>
                        <div className="multiselect form-control p-0">
                            {
                                materie.map(m => {
                                    let find = materieSel.find(f => f === m.idMateria),
                                    checked = find ? true : false,
                                    classname = checked ? "checked" : ""

                                    return <label className={"option " + classname}>
                                        <Checkbox className="mr-2" onChange={() => this.switchMateria(m.idMateria)} checked={checked} /> {m.nome}
                                    </label>
                                })
                            }
                        </div>
                    </div>

                    <div className="col">
                        <label className="text-secondary">Corsi del docente</label>
                        <div className="multiselect form-control p-0">
                            {
                                corsi.map(m => {
                                    let find = corsiSel.find(f => f === m.idCorso),
                                    checked = find ? true : false,
                                    classname = checked ? "checked" : ""

                                    return <label className={"option " + classname}>
                                        <Checkbox className="mr-2" onChange={() => this.switchCorso(m.idCorso)} checked={checked} /> {m.nome}
                                    </label>
                                })
                            }
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Modifica docente</button>
            </form>
        </div>
    }
}