import React from "react"
import { Modal, message } from "antd"

export interface IProps{
    readonly anno: number
    readonly corso: number
}
export interface IState{
    readonly calendarId: string
    readonly apiKey: string
}

export default class ConfigForm extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            calendarId: "",
            apiKey: ""
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

    changeKey = (e: any) => {
        let apiKey = e.target.value

        this.setState({
            apiKey: apiKey
        })
    }

    saveConfig = () => {
        const { corso, anno } = this.props
        const { calendarId, apiKey } = this.state

        if(calendarId === "" || apiKey === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        // SALVARE LA CONFIGURAZIONE
        message.success("Configurazione calendario salvata!")
    }
    render(): JSX.Element{
        const { calendarId, apiKey } = this.state

        // SE IL CALENDARIO NON È CARICATO SPIN

        return <form>
            <div className="form-group row">
                <div className="col">
                    <label className="text-secondary">ID Calendario</label>
                    <input name="calendarID" type="text" className="form-control" value={calendarId} onChange={this.changeID} />
                </div>
                <div className="col">
                    <label className="text-secondary">Chiave API</label>
                    <input name="apiKey" type="text" className="form-control" value={apiKey} onChange={this.changeKey} />
                </div>
            </div>

            <button type="button" className="btn btn-success float-right mr-1 mb-1" onClick={this.saveConfig}>Salva configurazione</button>
        </form>
    }
}