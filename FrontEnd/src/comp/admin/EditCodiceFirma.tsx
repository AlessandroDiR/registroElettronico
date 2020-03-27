import React from "react"
import { Modal } from "antd"
import { siteUrl } from "../../utilities"
import { askPassword } from "../AskConferma"

export interface IProps{}
export interface IState{}

export default class EditCodiceFirma extends React.PureComponent<IProps, IState>{
    requestCodeChange = (anno: number) => {
        askPassword(siteUrl+"/api/corsi/generacodiceanno", "post", {
            anno: anno
        }, (response: any) => {
            let codice = response.data

            Modal.info({
                title: "Codice generato",
                content: <span>
                    Il nuovo codice è: <strong>{codice}</strong>
                </span>
            })
        })
    }

    render(): JSX.Element{
        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-4 text-center">Gestione firma da casa</h3>

            <div className="py-4 px-3 text-justify border rounded shadow-sm mb-4">
                <div className="row mx-0">
                    <div className="col-1 text-left">
                        <i className="fal fa-question-circle fa-3x text-warning"></i>
                    </div>

                    <div className="col">
                        <p>Nel caso in cui ce ne fosse bisogno, è possibile dare agli studenti la possibilità di firmare le loro presenze da casa.</p>
                        <p>Tramite <a href={siteUrl+"/#/firmacasa"} target="_blank" rel="noopener noreferrer">questo url</a> (da condividere con gli studenti) è possibile eseguire tale operazione, ma per farlo è necessario generare, tramite la pagina corrente, un codice univoco che permetta l'accesso alla schermata. Basterà quindi digitarlo nell'apposito campo di testo e si accederà alla lista degli studenti presenti nella classe.</p>
                        <p>Lo studente sarà poi libero di scegliere il proprio nome nella lista, e confermando la propria identità tramite password avrà la possibilità di firmare.</p>
                        <p className="mb-0">Il codice sarà differente in base all'anno di appartenenza.</p>
                    </div>
                </div>
            </div>

            <strong className="mr-2">Genera codice:</strong>
            <button className="btn btn-blue mr-2" onClick={() => this.requestCodeChange(1)}>Primo anno</button>
            <button className="btn btn-danger" onClick={() => this.requestCodeChange(2)}>Secondo anno</button>
        </div>
    }
}