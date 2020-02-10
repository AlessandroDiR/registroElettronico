import React from "react"
import { ICorso } from "../../models/ICorso";
import Axios from "axios";
import { siteUrl } from "../../utilities";
import { Icon, Spin, Modal, Tooltip } from "antd";
import ImageScale from "../ImageScale";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly calendarId: string
    readonly apiKey: string
}

export default class ConfigCalendar extends React.PureComponent<IProps, IState>{
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
        /******************************************************/
    }

    showHideModal = () => {
        Modal.info({
            width: 700,
            style: { top: 24 },
            centered: false,
            maskClosable: true,
            icon: <Icon type="question-circle" style={{ marginTop: 6, fontSize: 28, color: "orange" }} />,
            okText: "Ho capito",
            content: <div className="text-justify">
                <strong>Dove mi trovo?</strong>
                <p>In questa pagina potrai configurare il calendario che vedranno gli studenti nel loro profilo.</p>
                <strong>Come si configura il calendario?</strong>
                <p>Per configurare il calendario avrai bisogno di due codici univoci, che ti permetteranno di collegare il calendario al sito.</p>
                <strong>API Key</strong>
                <p>Per trovare la chiave API, bisognerà recarsi a <a href="https://developers.google.com/calendar/quickstart/js?hl=it" target="_blank" rel="noopener noreferrer">questo <i className="far fa-external-link"></i></a> indirizzo ed effettuare il login con un qualsiasi account Google. Scendere in basso e cliccare sul bottone <strong>Create API Key</strong> (Crea chiave API), ed attendere il caricamento. Apparirà a schermo una finestra contentente la chiave: basterà copiare il codice ed inserirlo in questa pagina di configurazione.</p>
                <strong>ID del calendario</strong>
                <p>Per trovare l'ID (identificativo) del calendario, basterà effettuare l'accesso su <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">Google Calendar <i className="far fa-external-link"></i></a> con un account che abbia integrato il calendario del corso. Bisognerà poi premere sul simbolo <i className="far fa-cog"></i> in alto a destra e successivamente su <strong>Impostazioni</strong> nel menu che comparirà. Scorrere quindi la lista a sinistra della pagina, e cliccare sul calendario che si desidera integrare. Recarsi quindi sotto la voce <strong>Integra calendario</strong> e copiare (subito in basso) il codice identificativo del calendario (<strong>ID calendario</strong>), per poi incollarlo in questa pagina di configurazione.</p>
                <strong className="d-block mb-2">Galleria immagini</strong>
                <ImageScale src="https://i.imgur.com/u1qM1oD.png" width={143} />
                <ImageScale src="https://i.imgur.com/g0IjAtJ.png" scalable={true} height={100} />
                <ImageScale src="https://i.imgur.com/e3H0hXX.png" height={100} scalable={true} />
            </div>
        })

        setTimeout(() => document.getElementsByClassName('ant-modal-wrap')[0].scrollTo(0, 0), 100);
    }

    changeID = (event: any) => {
        let id = event.target.value

        this.setState({
            calendarId: id
        })
    }

    changeApi = (event: any) => {
        let key = event.target.value

        this.setState({
            apiKey: key
        })
    }

    saveConfig = () => {
        const { calendarId, apiKey } = this.state

        if(calendarId === "" || apiKey === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        /************************************************/
        /* CHIAMATA AXIOS PER SALVARE LA CONFIGURAZIONE */
        /************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Configurazione salvata."
        })
    }

    render(): JSX.Element{
        const { calendarId, apiKey } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">
                Configurazione calendario
                <Tooltip title="Informazioni">
                    <button type="button" className="btn btn-info circle-btn float-right" onClick={this.showHideModal}>
                        <i className="fa fa-question"></i>
                    </button>
                </Tooltip>
                <div className="clearfix"></div>
            </h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">ID Calendario</label>
                        <input type="text" className="form-control" value={calendarId} onChange={this.changeID} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Chiave API</label>
                        <input type="text" className="form-control" value={apiKey} onChange={this.changeApi} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.saveConfig}>Salva configurazione</button>
            </form>
        </div>
    }
}