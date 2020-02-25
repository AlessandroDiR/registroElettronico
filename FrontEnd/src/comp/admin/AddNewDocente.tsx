import React from "react"
import { Modal, message, Icon, Spin, Checkbox } from "antd"
import { routerHistory } from "../.."
import { siteUrl, adminRoute } from "../../utilities"
import Axios from "axios"
import { IMateria } from "../../models/IMateria"
import { ICorso } from "../../models/ICorso"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly CF: string
    readonly email: string
    readonly materie: IMateria[]
    readonly corsi: ICorso[]
    readonly materieSel: number[]
    readonly corsiSel: number[] 
}

export default class AddNewDocente extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            CF: "",
            email: "",
            corsi: null,
            materie: null,
            corsiSel: [],
            materieSel: []
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/corsi").then(response => {
            let corsi = response.data as ICorso[]

            this.setState({
                corsi: corsi
            })
        })

        Axios.get(siteUrl+"/api/materie/getmateriebycorso/"+this.props.corso).then(response => {
            let materie = response.data as IMateria[]

            this.setState({
                materie: materie
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

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiDocente = () => {
        const { nome, cognome,CF, email, corsiSel, materieSel } = this.state

        if(nome === "" || cognome === "" || CF === "" || email === ""){
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

        if(!materieSel.length){
            Modal.error({
                title: "Errore!",
                content: "Scegliere almeno una materia."
            })

            return
        }

        if(!corsiSel.length){
            Modal.error({
                title: "Errore!",
                content: "Scegliere almeno un corso."
            })

            return
        }

        Axios.post(siteUrl+"/api/docenti", {
            nome: nome,
            cognome: cognome,
            cf: CF,
            password: CF,
            email: email,
            tenere: corsiSel.map(c => { return { idCorso: c, idDocente: 0 } }),
            insegnare: materieSel.map(m => { return { idMateria: m, idDocente: 0 } }),
        }).then(_ => {
            message.success("Docente creato con successo!")
            routerHistory.push(adminRoute+"/docenti")
        })

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
        const { nome, cognome, CF, email, materie, materieSel, corsi, corsiSel } = this.state

        if(!materie || !corsi){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo docente</h3>

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
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input name="cf" type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
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

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Aggiungi docente</button>
            </form>
        </div>
    }
}