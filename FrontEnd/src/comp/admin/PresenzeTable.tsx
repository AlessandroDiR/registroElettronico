import React from "react"
import { IPresenze } from "../../models/IPresenze"
import { Tooltip, Icon, Spin, Modal } from "antd"
import { hideAll, siteUrl, formatItalian, startEdit } from "../../utilities"
import Axios from "axios"

export interface IProps{
    readonly studente: number
    reloadTotali(): void
}
export interface IState{
    readonly presenze: IPresenze[]
    readonly entrataEdit: string
    readonly uscitaEdit: string
}

export default class PresenzeTable extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            presenze: null,
            entrataEdit: "",
            uscitaEdit: ""
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/studenti/getdetailedpresences/"+this.props.studente).then((response) => {

            let presenze = response.data as IPresenze[]

            this.setState({
                presenze: presenze
            })
        })
    }

    changeEntrata = (event: any) => {
        let entrata = event.target.value

        this.setState({
            entrataEdit: entrata
        })
    }

    changeUscita = (event: any) => {
        let uscita = event.target.value

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

    validateTime = (time: string) => {
        return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time)
    }

    confirmEdit = (id: number) => {
        const { entrataEdit, uscitaEdit, presenze } = this.state

        if(!this.validateTime(entrataEdit) || !this.validateTime(uscitaEdit)){
            Modal.error({
                title: "Errore!",
                content: "Orari non validi!",
                maskClosable: true
            })

            return
        }

        let entrataSpan = document.getElementById("entrataSpan_" + id),
        uscitaSpan = document.getElementById("uscitaSpan_" + id),
        presenza = presenze.find(p => p.idPresenza === id)

        Axios.put(siteUrl+"/api/presenze/" + id, {
            idPresenza: presenza.idPresenza,
            idStudente: presenza.idStudente,
            ingresso: entrataEdit,
            uscita: uscitaEdit,
            idLezione: presenza.idLezione
        }).then(response => {
            let output = response.data

            if(output === "success"){
                let newPresenze = presenze.map(p => {
                    if(p.idPresenza === id){
                        let newP = p as any
                        newP.ingresso = entrataEdit
                        newP.uscita = uscitaEdit

                        return newP as IPresenze
                    }

                    return p
                })

                this.setState({
                    presenze: newPresenze
                })

                hideAll()
                
                this.animateSpans(entrataSpan, uscitaSpan)

                this.props.reloadTotali()
            }else{
                Modal.error({
                    title: "Errore!",
                    content: output
                })
            }
        })
    }

    render(): JSX.Element{
        const { presenze, entrataEdit, uscitaEdit } = this.state

        if(!presenze){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <table className="table table-bordered text-center">
            <tbody>
                <tr>
                    <th>Giorno</th>
                    <th>Entrata</th>
                    <th>Uscita</th>
                    <th>Lezione</th>
                    <th>Azioni</th>
                </tr>

                {
                    presenze.map(p => {
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
                            <td>
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
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}