import React from "react"
import { Tooltip, Icon, Spin, Modal, Select } from "antd"
import { hideAll, siteUrl, formatItalian, startEdit, validateTime } from "../../utilities"
import Axios from "axios"
import { IPresenzaDocente } from "../../models/IPresenzaDocente"

export interface IProps{
    readonly idDocente: string
    readonly canEdit: boolean
    readonly corso: number
}
export interface IState{
    readonly presenze: IPresenzaDocente[]
    readonly entrataEdit: string
    readonly uscitaEdit: string
    readonly filter: string
}

export default class LezioniDocenteTable extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            presenze: null,
            entrataEdit: "",
            uscitaEdit: "",
            filter: null
        }
    }

    componentDidMount = () => {
        const { corso, idDocente } = this.props

        Axios.get(siteUrl+"/api/lezioni/getlezionidocente/"+idDocente+"/"+corso).then(response => {
            let presenze = response.data as IPresenzaDocente[]

            this.setState({
                presenze: presenze
            })
        })
    }

    changeEntrata = (event: any) => {
        let entrata = event.target.value.trim()

        this.setState({
            entrataEdit: entrata
        })
    }

    changeUscita = (event: any) => {
        let uscita = event.target.value.trim()

        this.setState({
            uscitaEdit: uscita
        })
    }

    startTimeEdit = (id: number) => {
        let presenza = this.state.presenze.find(p => p.idPresenza === id)

        startEdit(id)

        this.setState({
            entrataEdit: presenza.ingresso,
            uscitaEdit: presenza.uscita
        })
    }

    animateSpans = (span1: HTMLElement, span2: HTMLElement) => {
        let node1 = span1.parentNode as HTMLElement,
        node2 = span2.parentNode as HTMLElement

        node1.classList.add("edited")
        node2.classList.add("edited")

        setTimeout(() => {
            node1.classList.remove("edited")
            node2.classList.remove("edited")
        }, 1000)
    }

    confirmEdit = (id: number) => {
        const { entrataEdit, uscitaEdit, presenze } = this.state
        
        if(!validateTime(entrataEdit) || !validateTime(uscitaEdit)){
            Modal.error({
                title: "Errore!",
                content: "Orari non validi! (ore:minuti:secondi)",
                maskClosable: true
            })

            return
        }

        let entrataSpan = document.getElementById("entrataSpan_" + id),
        uscitaSpan = document.getElementById("uscitaSpan_" + id),
        presenza = presenze.find(p => p.idPresenza === id)

        Axios.put(siteUrl+"/api/presenzedocente/"+id, {
            idPresenza: id,
            ingresso: entrataEdit,
            uscita: uscitaEdit,
            idDocente: presenza.idDocente,
            idLezione: presenza.idLezione
        }).then(response => {
            let output = response.data

            if(output === "success"){
                let newPresenze = presenze.map(p => {
                    if(p.idPresenza === id){
                        let newP = p as any
                        newP.ingresso = entrataEdit
                        newP.uscita = uscitaEdit

                        return newP as IPresenzaDocente
                    }

                    return p
                })

                this.setState({
                    presenze: newPresenze
                })

                hideAll()
                
                this.animateSpans(entrataSpan, uscitaSpan)
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

    render(): JSX.Element{
        const { presenze, entrataEdit, uscitaEdit, filter } = this.state,
        { canEdit } = this.props,
        { Option } = Select

        if(!presenze){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div>
                <Spin indicator={icon} className="mt-3" />
            </div>
        }

        let presences = filter ? presenze.filter(p => p.lezione.toLowerCase() === filter.toLowerCase()) : presenze

        return <div className="mt-3">
            <h3 className="d-inline-block">Lezioni tenute dal docente</h3>

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
                    <tr className="thead-light">
                        <th>Giorno</th>
                        <th>Entrata</th>
                        <th>Uscita</th>
                        <th>Lezione</th>
                        {
                            canEdit && <th>Azioni</th>
                        }
                    </tr>

                    {
                        presences.map(p => {
                            return <tr>
                                <td style={{maxWidth: 0}} className="text-truncate">{formatItalian(p.data)}</td>
                                <td style={{maxWidth: 0}} className="text-truncate">
                                    <span id={"entrataSpan_"+p.idPresenza}>{p.ingresso}</span>
                                    <input type="text" className="form-control edit-time" value={entrataEdit} style={{display: "none"}} onChange={this.changeEntrata} id={"entrataInput_"+p.idPresenza} />
                                </td>
                                <td style={{maxWidth: 0}} className="text-truncate">
                                    <span id={"uscitaSpan_"+p.idPresenza}>{p.uscita}</span>
                                    <input type="text" className="form-control edit-time" value={uscitaEdit} style={{display: "none"}} onChange={this.changeUscita} id={"uscitaInput_"+p.idPresenza} />
                                </td>
                                <Tooltip title={p.lezione}>
                                    <td style={{maxWidth: 0}} className="text-truncate">{p.lezione}</td>
                                </Tooltip>
                                {
                                    canEdit && <td>
                                        <Tooltip title="Modifica orari">
                                            <button type="button" className="btn btn-orange circle-btn" onClick={() => this.startTimeEdit(p.idPresenza)} id={"editBtn_"+p.idPresenza}>
                                                <i className="fa fa-user-edit"></i>
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Conferma modifiche">
                                            <button type="button" className="btn btn-success circle-btn" onClick={() => this.confirmEdit(p.idPresenza)} id={"confirmBtn_"+p.idPresenza} style={{display: "none"}}>
                                                <i className="fa fa-check"></i>
                                            </button>
                                        </Tooltip>
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