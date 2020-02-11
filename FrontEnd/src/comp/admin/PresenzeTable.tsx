import React from "react"
import { IPresenze } from "../../models/IPresenze"
import { Tooltip, Icon, Spin } from "antd"
import { hideAll, siteUrl, formattaData } from "../../utilities"
import Axios from "axios"

export interface IProps{
    readonly studente: number
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
        let entrataInput = document.getElementById("entrataInput_" + id),
        uscitaInput = document.getElementById("uscitaInput_" + id),
        entrataSpan = document.getElementById("entrataSpan_" + id),
        uscitaSpan = document.getElementById("uscitaSpan_" + id),
        editBtn = document.getElementById("editBtn_" + id),
        confirmBtn = document.getElementById("confirmBtn_" + id),
        presenza = this.state.presenze.find(p => p.idPresenza === id)

        hideAll()

        entrataInput.style.display = "block"
        uscitaInput.style.display = "block"
        confirmBtn.style.display = "inline-block"
        entrataSpan.style.display = "none"
        uscitaSpan.style.display = "none"
        editBtn.style.display = "none"

        this.setState({
            entrataEdit: presenza.ingresso,
            uscitaEdit: presenza.uscita
        })
    }

    confirmEdit = (id: number) => {
        let entrataInput = document.getElementById("entrataInput_" + id) as HTMLInputElement,
        uscitaInput = document.getElementById("uscitaInput_" + id) as HTMLInputElement,
        entrataSpan = document.getElementById("entrataSpan_" + id),
        uscitaSpan = document.getElementById("uscitaSpan_" + id),
        editBtn = document.getElementById("editBtn_" + id),
        confirmBtn = document.getElementById("confirmBtn_" + id)

        /*****************************************************/
        /* MODIFICA DEGLI ORARI DI ENTRATA ED USCITA         */
        /* id, this.state.entrataEdit, this.state.uscitaEdit */
        /*****************************************************/

        entrataSpan.style.display = "block"
        uscitaSpan.style.display = "block"
        editBtn.style.display = "inline-block"
        entrataInput.style.display = "none"
        uscitaInput.style.display = "none"
        confirmBtn.style.display = "none"
    }

    render(): JSX.Element{
        const { presenze, entrataEdit, uscitaEdit } = this.state

        if(!presenze){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <table className="table table-bordered text-center mt-3">
            <tbody>
                <tr className="thead-light">
                    <th>Giorno</th>
                    <th>Entrata</th>
                    <th>Uscita</th>
                    <th>Lezione</th>
                    <th>Azioni</th>
                </tr>

                {
                    presenze.map(p => {
                        return <tr>
                            <td style={{maxWidth: 0}} className="text-truncate">{formattaData(p.data)}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">
                                <span id={"entrataSpan_"+p.idPresenza}>{p.ingresso}</span>
                                <input type="text" className="form-control edit-time" value={entrataEdit} style={{display: "none"}} onChange={this.changeEntrata} id={"entrataInput_"+p.idPresenza} />
                            </td>
                            <td style={{maxWidth: 0}} className="text-truncate">
                                <span id={"uscitaSpan_"+p.idPresenza}>{p.uscita}</span>
                                <input type="text" className="form-control edit-time" value={uscitaEdit} style={{display: "none"}} onChange={this.changeUscita} id={"uscitaInput_"+p.idPresenza} />
                            </td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.lezione}</td>
                            <td>
                                <Tooltip title="Modifica orari">
                                    <button type="button" className="far fa-clock btn btn-orange circle-btn" onClick={() => this.startTimeEdit(p.idPresenza)} id={"editBtn_"+p.idPresenza}></button>
                                </Tooltip>
                                <Tooltip title="Conferma modifiche">
                                    <button type="button" className="far fa-check btn btn-success circle-btn" onClick={() => this.confirmEdit(p.idPresenza)} id={"confirmBtn_"+p.idPresenza} style={{display: "none"}}></button>
                                </Tooltip>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}