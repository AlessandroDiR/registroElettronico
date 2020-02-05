import React from "react"
import Dragger from "antd/lib/upload/Dragger"
import { IStudent } from "../../models/IStudent"
import { Checkbox, Modal, Tooltip } from "antd"
import { routerHistory } from "../.."
import { formattaData, capitalizeFirst } from "../../utilities"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly addList: IStudent[]
    readonly jumpFirstLine: boolean
}

export default class StudentsImport extends React.PureComponent<IProps, IState>{
    
    constructor(props: IProps){
        super(props)

        this.state = {
            addList: [],
            jumpFirstLine: false
        }
    }

    splitCSV = (data: string) => {
        let regex = /(["'])(?:(?=(\\?))\2.)*?\1/g,
        pieces = data.match(regex)

        console.log(pieces)
        return pieces.map(p => { return p.replace(/["]/g, '')} )
    }

    readFile = (file: any) => {
        const reader = new FileReader()

        reader.onload = e => {
            let rows = String(e.target.result).trim().split("\n"),
            list: IStudent[] = [],
            popup = document.getElementById("popup")

            rows.forEach((r, i) => {
                
                if(i === 0 && this.state.jumpFirstLine)
                    return

                let cells = this.splitCSV(r)

                let student: IStudent = {
                    corso: this.props.corso,
                    nome: capitalizeFirst(cells[7]),
                    cognome: capitalizeFirst(cells[8]),
                    anno: Number(cells[2]),
                    cf: cells[3],
                    dataNascita: formattaData(cells[10], true),
                    luogoNascita: "",
                    email: cells[22]
                }

                list.push(student)
            })

            this.setState({
                addList: list
            })

            popup.classList.add("show")
        }

        reader.readAsText(file, "ISO-8859-1")

        return false
    }

    checkUncheck = () => {
        this.setState({
            jumpFirstLine: !this.state.jumpFirstLine
        })
    }

    hidePopup = () => {
        let popup = document.getElementById("popup")

        this.setState({
            addList: []
        })

        popup.classList.remove("show")
    }

    confirmImport = () => {
        /*************************************/
        /* INSERIMENTO DI this.state.addList */
        /*************************************/

        Modal.success({
            title: "Congratulazioni!",
            content: "Importazione eseguita con successo.",
            onOk: () => {
                routerHistory.push("/adminpanel/studenti")
            }
        })
    }

    render(): JSX.Element{
        const { addList } = this.state

        return <div className="col-9 p-5 right-block" id="mainBlock" style={{flexDirection: "column"}}>
            <h3 className="text-center w-100">Importa studenti da CSV</h3>

            <label className="pointer">
                <Checkbox checked={this.state.jumpFirstLine} onChange={this.checkUncheck} className="mr-2" />
                Saltare la prima riga del file (solo se contiene i nomi dei campi della tabella)
            </label>

            <div className="uploader mt-2 w-100">
                <Dragger accept=".csv" beforeUpload={file => this.readFile(file)} style={{width: "100%"}}>
                    <p className="ant-upload-drag-icon">
                        <i className="fa fa-file-csv fa-5x"></i>
                    </p>
                    <p className="ant-upload-text">Clicca o trascina un file su quest'aerea</p>
                    <p className="ant-upload-hint">
                        Assicurati che il file abbia l'estensione <strong>.csv</strong>.
                    </p>
                </Dragger>
            </div>

            <div id="popup" className="col-9 preview px-0">
                <div className="w-100 h-100 inner overflow-auto px-5 py-4">
                    <h3 className="mb-3 text-center">Anteprima dati da importare</h3>
                    {
                        addList.length && <table className="table table-bordered text-center">
                            <tbody>
                                <tr>
                                    <th>Nome</th>
                                    <th>Cognome</th>
                                    <th>Anno</th>
                                    <th>Codice Fiscale</th>
                                    <th>Data di Nascita</th>
                                    <th style={{width: "25%"}}>E-mail</th>
                                </tr>

                                {
                                    addList.map(s => {                
                                        return <tr>
                                            <Tooltip title={s.nome}>
                                                <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                            </Tooltip>
                                            <Tooltip title={s.cognome}>
                                                <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                            </Tooltip>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.anno}</td>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.dataNascita}</td>
                                            <Tooltip title={s.email}>
                                                <td style={{maxWidth: 0}} className="text-truncate">{s.email}</td>
                                            </Tooltip>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>

                <div className="bottom-side p-3 text-right">
                    <button className="btn btn-danger mr-2" onClick={() => this.hidePopup()}>Annulla</button>
                    <button className="btn btn-success" onClick={this.confirmImport}>Conferma importazione</button>
                </div>
            </div>
        </div>
    }
}