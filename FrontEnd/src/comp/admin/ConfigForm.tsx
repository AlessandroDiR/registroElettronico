import React from "react"
import { Modal, message } from "antd"
import Axios from "axios"
import { siteUrl } from "../../utilities"

export interface IProps{
    readonly anno: number
    readonly corso: number
}
export interface IState{
    readonly calendarId: string
}

export default class ConfigForm extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            calendarId: ""
        }
    }

    componentDidMount = () => {
        /******************************************************/
        /* CARICARE LA CONFIGURAZIONE CORRENTE DEL CALENDARIO */
        /* di this.props.corso e this.props.anno              */
        /******************************************************/
    }

    changeID = (e: any) => {
        let calendarId = e.target.value

        this.setState({
            calendarId: calendarId
        })
    }

    saveConfig = () => {
        const { corso, anno } = this.props
        const { calendarId } = this.state

        if(calendarId === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        Axios.post(siteUrl+"/api/configcalendario", {
            idCorso: corso,
            anno: anno,
            calendarId: calendarId
        }).then(_ => {
            message.success("Configurazione calendario salvata!")
        })
    }
    render(): JSX.Element{
        const { calendarId } = this.state

        // SE IL CALENDARIO NON È CARICATO SPIN

        return <form>
            <div className="form-group row">
                <div className="col">
                    <label className="text-secondary">ID Calendario</label>
                    <input name="calendarID" type="text" className="form-control" value={calendarId} onChange={this.changeID} />
                </div>
            </div>

            <button type="button" className="btn btn-success float-right mr-1 mb-1" onClick={this.saveConfig}>Salva configurazione</button>
        </form>
    }
}