import React from "react"
import { IPresenze } from "../../models/IPresenze"
import { Tooltip, Icon, Spin, Modal, Select, TimePicker } from "antd"
import { siteUrl, formatItalian, validateTime, convertFromUTC, getDateTime } from "../../utilities"
import Axios from "axios"
import { askPassword } from "../AskConferma"
import { IStudent } from "../../models/IStudent"
import moment from "moment"

export interface IProps{
    readonly studente: IStudent
    reloadTotali(): void
}
export interface IState{
    readonly presenze: IPresenze[]
    readonly editingList: IPresenze[]
    readonly filter: string
}

export default class PresenzeTable extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            presenze: null,
            editingList: [],
            filter: null
        }
    }

    componentDidMount = () => {
        const { studente } = this.props

        Axios.get(siteUrl+"/api/studenti/getdetailedpresences/"+studente.idStudente).then(response => {

            let presenze = response.data as IPresenze[]

            this.setState({
                presenze: presenze.map(p => {
                    p.ingresso = convertFromUTC(p.ingresso)
                    p.uscita = getDateTime(p.uscita) === "00:00" ? "Non firmata" : convertFromUTC(p.uscita)

                    return p
                })
            })
        })
    }

    changeEntrata = (entrata: string, idPresenza: number) => {
        let presenze = this.state.editingList.map(p => {
            if(p.idPresenza === idPresenza)
                p.ingresso = entrata

            return p
        }) 

        this.setState({
            editingList: presenze
        })
    }

    changeUscita = (uscita: string, idPresenza: number) => {
        let presenze = this.state.editingList.map(p => {
            if(p.idPresenza === idPresenza)
                p.uscita = uscita

            return p
        }) 

        this.setState({
            editingList: presenze
        })
    }

    startTimeEdit = (p: IPresenze) => {
        this.setState({
            editingList: this.state.editingList.concat(p)
        })
    }

    animateTds = (td1: HTMLElement, td2: HTMLElement) => {
        td1.classList.add("edited")
        td2.classList.add("edited")

        setTimeout(() => {
            td1.classList.remove("edited")
            td2.classList.remove("edited")
        }, 1000)
    }

    confirmEdit = (id: number, td1: HTMLElement, td2: HTMLElement) => {
        const { presenze, editingList } = this.state,
        presenza = editingList.find(p => p.idPresenza === id)

        if(!validateTime(presenza.ingresso) || !validateTime(presenza.uscita)){
            Modal.error({
                title: "Errore!",
                content: "Orari non validi. (ore:minuti)",
                maskClosable: true
            })

            return
        }

        let data = new Date()

        askPassword(siteUrl+"/api/presenze/" + id, "put", {
            idPresenza: presenza.idPresenza,
            idStudente: presenza.idStudente,
            ingresso: new Date(`${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${presenza.ingresso}`),
            uscita: new Date(`${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${presenza.uscita}`),
            idLezione: presenza.idLezione
        }, (response: any) => {
            let output = response.data

            if(output.trim() === "success"){
                let newPresenze = presenze.map(p => {
                    if(p.idPresenza === id){
                        return presenza
                    }

                    return p
                })

                this.setState({
                    presenze: newPresenze,
                    editingList: editingList.filter(p => p.idPresenza !== presenza.idPresenza)
                })

                this.animateTds(td1, td2)
                this.props.reloadTotali()
            }else{
                Modal.error({
                    title: "Errore!",
                    content: output
                })
            }
        })
    }

    getCategorie = () => {
        const { presenze } = this.state 
        let categorie: string[] = []

        presenze.forEach(p => {
            if(categorie.indexOf(p.lezione) === -1)
                categorie.push(p.lezione)
        })

        return categorie
    }

    changeFilter = (filter: string) => {
        this.setState({
            filter: filter === "" ? null : filter
        })
    }

    annullaModifica = (presenza: IPresenze) => {
        this.setState({
            editingList: this.state.editingList.filter(p => p.idPresenza !== presenza.idPresenza)
        })
    }

    render(): JSX.Element{
        const { presenze, editingList, filter } = this.state,
        { studente } = this.props,
        { Option } = Select

        if(!presenze){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div>
                <Spin indicator={icon} className="mt-3" />
            </div>
        }

        let presences = filter ? presenze.filter(p => p.lezione.toLowerCase() === filter.toLowerCase()) : presenze

        return <div className="mt-3">

            <h3 className="d-inline-block">Presenze dello studente</h3>

            <div className="float-right">
                <label className="d-inline-block text-secondary mr-2">Filtra per materia: </label>
                <Select defaultValue="" style={{ width: 150 }} onChange={this.changeFilter} showSearch>
                    <Option value="">Nessuna</Option>
                    {
                        this.getCategorie().map(l =>{
                            return <Option value={l}>{l}</Option>
                        })
                    }
                </Select>
            </div>
            
            <div className="clearfix"></div>

            <table className="table table-bordered text-center">
                <tbody>
                    <tr>
                        <th>Giorno</th>
                        <th>Entrata</th>
                        <th>Uscita</th>
                        <th>Lezione</th>
                        {
                            !studente.promosso && <th style={{ width: "20%" }}>Azioni</th>
                        }
                    </tr>

                    {
                        presences.map(p => {
                            let presenzaEdit = editingList.find(pre => pre.idPresenza === p.idPresenza),
                            td1: HTMLElement,
                            td2: HTMLElement

                            return <tr>
                                <td style={{maxWidth: 0}} className="text-truncate">{formatItalian(p.data)}</td>
                                <td style={{maxWidth: 0}} className="text-truncate" ref={r => td1 = r}>
                                    {
                                        presenzaEdit ? <TimePicker defaultValue={moment(p.ingresso, 'HH:mm')} format='HH:mm' onChange={(_, ingresso) => this.changeEntrata(ingresso, p.idPresenza)} minuteStep={10} placeholder="Seleziona una data" /> : <span>{p.ingresso}</span>
                                    }
                                </td>
                                <td style={{maxWidth: 0}} className="text-truncate" ref={r => td2 = r}>
                                    {
                                        presenzaEdit ? <TimePicker defaultValue={moment(p.uscita, 'HH:mm')} format='HH:mm' onChange={(_, uscita) => this.changeUscita(uscita, p.idPresenza)} minuteStep={10} placeholder="Seleziona una data" /> : <span>{p.uscita}</span>
                                    }
                                </td>
                                <Tooltip title={p.lezione}>
                                    <td style={{maxWidth: 0}} className="text-truncate">{p.lezione}</td>
                                </Tooltip>
                                {
                                    !studente.promosso && <td>
                                        {
                                            presenzaEdit ? <div>
                                                <Tooltip title="Annulla">
                                                    <button type="button" className="btn btn-danger circle-btn" onClick={() => this.annullaModifica(p)} >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </Tooltip>

                                                <Tooltip title="Conferma modifiche">
                                                    <button type="button" className="btn btn-success circle-btn ml-2" onClick={() => this.confirmEdit(p.idPresenza, td1, td2)} >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                </Tooltip>
                                            </div> : <Tooltip title="Modifica orari">
                                                <button type="button" className="btn btn-orange circle-btn" onClick={() => this.startTimeEdit(p)}>
                                                    <i className="fa fa-user-edit"></i>
                                                </button>
                                            </Tooltip>
                                        }
                                    </td>
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    }
}