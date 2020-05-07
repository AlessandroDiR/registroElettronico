import React from "react"
import Dragger from "antd/lib/upload/Dragger"
import { IStudent } from "../../models/IStudent"
import { Modal, Tooltip, Icon, message } from "antd"
import { routerHistory } from "../.."
import { formattaData, capitalizeFirst, siteUrl, resizePopup, formatItalian, adminRoute } from "../../utilities"
import { askPassword } from "../AskConferma"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly addList: IStudent[]
    readonly fileContent: string
    readonly fields: any
    readonly loading: boolean
}

const fields = [{
    label: "Nome",
    field: "nome"
},{
    label: "Cognome",
    field: "cognome"
},{
    label: "Codice Fiscale",
    field: "cf"
},{
    label: "Data di nascita",
    field: "dataNascita"
},{
    label: "E-mail",
    field: "email"
}]

export default class StudentsImport extends React.PureComponent<IProps, IState>{
    
    constructor(props: IProps){
        super(props)

        this.state = {
            addList: [],
            fileContent: "",
            fields: {
                nome: 0,
                cognome: 0,
                cf: 0,
                dataNascita: 0,
                email: 0,
                annoFrequentazione: 1
            },
            loading: false
        }
    }

    componentDidMount = () => {
        resizePopup()
    }

    splitCSV = (data: string) => {
        let regex = /(["'])(?:(?=(\\?))\2.)*?\1/g,
        pieces = data.match(regex)

        return pieces.map(p => { return p.replace(/["]/g, '') })
    }

    renderOptions = () => {
        let rows = this.state.fileContent.split("\n"),
        cells = this.splitCSV(rows[0]),
        options = cells.map((c, i) => {
            if(c === "")
                return null

            return <option value={i}>{c}</option>
        })

        return options
    }

    changeVarPos = (e: any, varName: string) => {
        let value = e.target.value,
        obj = this.state.fields

        obj[varName] = value

        this.setState({
            fields: obj
        })
    }

    readFile = (file: any) => {
        const reader = new FileReader()

        reader.onload = e => {
            this.setState({
                fileContent: String(e.target.result).trim()
            })

            Modal.info({
                width: 500,
                centered: true,
                title: "Selezionare i campi da abbinare",
                icon: <Icon type="api" style={{ color: "var(--success)" }} />,
                maskClosable: true,
                content: <div style={{ marginLeft: -38 }}>
                    <div className="row mt-3 px-0">
                        <div className="col-4">
                            <label className="mt-2">Classe: </label>
                        </div>
                        <div className="col">
                            <select className="custom-select pointer" style={{ height: 35 }} onChange={(e) => this.changeVarPos(e, "annoFrequentazione")}>
                                <option value="1">Primo anno</option>
                                <option value="2">Secondo anno</option>
                            </select>
                        </div>
                    </div>
                    {
                        fields.map(f => {
                            return <div className="row mt-3 px-0">
                                <div className="col-4">
                                    <label className="mt-2">{f.label}: </label>
                                </div>
                                <div className="col">
                                    <select className="custom-select pointer" style={{ height: 35 }} onChange={(e) => this.changeVarPos(e, f.field)}>
                                        {this.renderOptions()}
                                    </select>
                                </div>
                            </div>
                        })
                    }
                </div>,
                onOk: this.showImportPreview,
                okText: "Prosegui"
            })
        }

        reader.readAsText(file, "ISO-8859-1")

        return false
    }

    showImportPreview = () => {
        const { fileContent, fields} = this.state

        let rows = fileContent.split("\n"),
        list: IStudent[] = [],
        popup = document.getElementById("popup")

        rows.forEach(r => {
            let cells = this.splitCSV(r)

            let student: IStudent = {
                idCorso: this.props.corso,
                nome: capitalizeFirst(cells[fields['nome']]),
                cognome: capitalizeFirst(cells[fields['cognome']]),
                annoFrequentazione: parseInt(fields['annoFrequentazione']),
                cf: cells[fields['cf']],
                dataNascita: formattaData(cells[fields['dataNascita']], true),
                email: cells[fields['email']],
                password: cells[fields['cf']]
            }

            list.push(student)
        })

        this.setState({
            addList: list
        })

        popup.classList.add("show")
    }

    hidePopup = () => {
        let popup = document.getElementById("popup")

        this.setState({
            addList: [],
            fields: {
                nome: 0,
                cognome: 0,
                cf: 0,
                dataNascita: 0,
                email: 0,
                annoFrequentazione: 0
            }
        })

        popup.classList.remove("show")
    }

    confirmImport = () => {
        this.toggleLoading()

        askPassword(siteUrl+"/api/studenti", "post", {
            studenti: this.state.addList
        }, (_: any) => {
            this.toggleLoading()
            message.success("Importazione eseguita con successo!")
            routerHistory.push(adminRoute+"/studenti")
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    render(): JSX.Element{
        const { addList, loading } = this.state

        return <div className="col p-5 right-block" id="mainBlock" style={{flexDirection: "column"}}>
            <h3 className="text-center w-100">Importa studenti da CSV</h3>

            <label>
                Prima di proseguire, esportare il CSV da <strong>Sifer</strong>.
            </label>

            <div className="uploader mt-2 w-100">
                <Dragger accept=".csv" beforeUpload={file => this.readFile(file)}>
                    <p className="ant-upload-drag-icon">
                        <i className="fa fa-file-csv fa-5x"></i>
                    </p>
                    <p className="ant-upload-text">Clicca o trascina un file su quest'aerea</p>
                    <p className="ant-upload-hint">
                        Assicurati che il file abbia l'estensione <strong>.csv</strong>.
                    </p>
                </Dragger>
            </div>

            <div id="popup" className="preview px-0">
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
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.annoFrequentazione}</td>
                                            <Tooltip title={s.cf}>
                                                <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                            </Tooltip>
                                            <td style={{maxWidth: 0}} className="text-truncate">{formatItalian(s.dataNascita)}</td>
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
                    <button className="btn btn-danger mr-2" onClick={this.hidePopup} disabled={loading}>Annulla</button>
                    <button className="btn btn-success" onClick={this.confirmImport} disabled={loading}>
                        {
                            loading && <Icon type="loading" className="mr-2 loadable-btn" spin />
                        }
                        Conferma importazione
                    </button>
                </div>
            </div>
        </div>
    }
}