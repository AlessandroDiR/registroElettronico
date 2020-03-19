import React from "react"
import { IStudent } from "../../models/IStudent"
import { routerHistory } from "../.."
import { Modal, Tooltip, Spin, Icon, Checkbox, Collapse, DatePicker, message, Tabs } from "antd"
import Axios from "axios"
import { siteUrl, formattaData, adminRoute } from "../../utilities"
import locale from "antd/es/date-picker/locale/it_IT"
import { askPassword } from "../AskConferma"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly students: IStudent[]
    readonly selection: IStudent[]
    readonly confirmModal: boolean
}

export default class StudentsList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            students: null,
            selection: [],
            confirmModal: false
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/studenti/"+this.props.corso).then((response) => {
            this.setState({
                students: response.data as IStudent[]
            })
        })
    }

    showConfirm = (student: IStudent) => {
        const { students } = this.state
        let date: string = ""

        Modal.confirm({
            title: `ATTENZIONE: si sta per ritirare uno studente (${student.nome} ${student.cognome})`,
            content: <div style={{ marginLeft: -38 }}>
                <p>I dati identificativi dello studente e le sue frequenze verranno comunque mantenuti.</p>
                <label className="text-secondary">Data di ritiro</label>
                
                <DatePicker locale={locale} className="w-100" onChange={(_, d2) => date = d2} format="DD-MM-YYYY" />
            </div>,
            okText: "Conferma ritiro",
            okType: "danger",
            cancelText: "Annulla",
            onOk: () => {
                if(date === ""){
                    Modal.error({
                        title: "Errore!",
                        content: "Seleziona una data valida."
                    })

                    return true
                }

                let dataRitiro = formattaData(date, true),
                studente = student as any
                studente.ritirato = "true"
                studente.dataRitiro = dataRitiro
                
                this.setState({
                    students: null
                })
                
                Axios.put(siteUrl+"/api/studenti/"+student.idStudente, {...studente}).then(response => {

                    let stu = response.data as IStudent,
                    currentList = students as any,
                    editingStudent = students.indexOf(student)
                    
                    currentList[editingStudent] = stu

                    this.setState({
                        students: currentList as IStudent[]
                    })

                    message.success("Studente ritirato con successo!")
                })
            }
        })
    }

    changeSelection = (student: IStudent) => {
        let find = this.state.selection.find(s => s === student),
        newList = find ? this.state.selection.filter(s => s.idStudente !== student.idStudente) : this.state.selection.concat(student)

        this.setState({
            selection: newList
        })
    }

    selectAll = (anno: number, event: any) => {
        let selectionList = event.target.checked ? this.state.students.filter(s => s.annoFrequentazione === anno && !s.ritirato) : this.state.selection.filter(s => s.annoFrequentazione !== anno)

        this.setState({
            selection: selectionList
        })
    }

    showHideModal = () => {
        if(!this.state.selection.length){
            Modal.info({
                title: "Attenzione!",
                content: "Devi selezionare almeno uno studente."
            })

            return
        }

        this.setState({
            confirmModal: !this.state.confirmModal
        })
    }

    moveStudents = () => {
        let select = document.getElementById("moveToClass") as HTMLSelectElement,
        value = parseInt(select.value),
        studenti = this.state.selection.map(s => {
            let stu = s as any
            stu.idCorso = this.props.corso
            stu.annoFrequentazione = value

            return stu
        })

        if(value !== 1 && value !== 2){
            Modal.error({
                title: "Errore!",
                content: "L'anno selezionato non è valido."
            })
        }

        this.setState({
            students: null,
            selection: []
        })

        Axios.put(siteUrl+"/api/studenti", studenti).then(response => {
            this.setState({
                students: response.data as IStudent[]
            })

            message.success("Studenti spostati con successo!")
        })


        this.showHideModal()
    }

    allRetired = (group: IStudent[]) => {
        let allRetired = true

        group.forEach(s => {
            if(!s.ritirato)
                allRetired = false
        })

        return !allRetired
    }

    sortbyId = (a: IStudent, b: IStudent) => { 
        if(a.idStudente > b.idStudente)
            return-1
        if(a.idStudente < b.idStudente)
            return 1

        return 0
    }

    promuoviStudent = (s: IStudent) => {
        Modal.confirm({
            title: `${s.nome} ${s.cognome}`,
            content: "Confermi di voler segnare questo studente come promosso?",
            okText: "Conferma",
            okType: "primary",
            cancelText: "Annulla",
            onOk: () => {
                this.setState({
                    students: null
                })

                askPassword(siteUrl+"/api/studenti/promuovistudente", "post", {
                    idStudente: s.idStudente
                }, (response: any) => {
                    let studenti = response.data as IStudent[]
        
                    this.setState({
                        students: studenti
                    })
        
                    message.success("Studente promosso con successo!")
                })
            }
        })
    }

    render(): JSX.Element{
        const { students, selection } = this.state,
        { Panel } = Collapse,
        { TabPane } = Tabs
        
        if(!students){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }
        
        let firstYear = students.filter(s => s.annoFrequentazione === 1 && !s.promosso).sort(this.sortbyId).sort((a, _) => a.ritirato ? 0 : -1),
        secondYear = students.filter(s => s.annoFrequentazione === 2 && !s.promosso).sort(this.sortbyId).sort((a, _) => a.ritirato ? 0 : -1),
        groups = [firstYear, secondYear],
        ritirati = students.filter(s => s.promosso).sort(this.sortbyId)

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Studenti del corso</h3>

            <Tabs defaultActiveKey="1">
                <TabPane tab={<span><i className="fal fa-user fa-fw mr-1"></i> Studenti attivi</span>} key="1">
                    <button className="btn btn-success float-right" type="button" onClick={() => routerHistory.push(adminRoute+"/studenti/new")}>
                        <i className="fal fa-plus"></i> Aggiungi studente
                    </button>

                    <button className="btn btn-orange float-right mr-2" type="button" onClick={this.showHideModal}>
                        <i className="fa fa-arrows-alt"></i> Sposta studenti
                    </button>

                    <button className="btn btn-blue float-right mr-2" type="button" onClick={() => routerHistory.push(adminRoute+"/studenti/import")}>
                        <i className="fa fa-file-csv"></i> Importa da CSV
                    </button>

                    <div className="clearfix"></div>

                    <Tabs defaultActiveKey="0">
                        
                        {
                            groups.map((g, i) => {
                                if(!g[0])
                                    return false
                                    
                                let checkedAll = this.allRetired(g),
                                tabTitle = g[0].annoFrequentazione === 1 ? "Primo" : "Secondo"

                                g.forEach(element => {
                                    if(selection.indexOf(element) === -1 && !element.ritirato)
                                        checkedAll = false
                                })

                                return <TabPane tab={tabTitle + " anno"} key={i.toString()}>
                                    <table className="table table-bordered text-center">

                                        <tbody className="border-top-0">
                                            <tr>
                                                <th style={{width: "5%"}}>
                                                    <Tooltip title="Seleziona tutti">
                                                        <Checkbox onChange={(e) => this.selectAll(g[0].annoFrequentazione, e)} checked={checkedAll} />
                                                    </Tooltip>
                                                </th>
                                                <th>Nome</th>
                                                <th>Cognome</th>
                                                <th>Codice Fiscale</th>
                                                <th style={{width: "15%"}}>Frequenza</th>
                                                <th style={{width: "26%"}}>Azioni</th>
                                            </tr>
                                
                                            {
                                                g.map(s => {
                                                    let checked = this.state.selection.find(n => n === s) ? true : false,
                                                    bg = s.ritirato ? "light font-italic" : "white"
                            
                                                    return <tr className={"bg-"+bg}>
                                                        <td>
                                                            {
                                                                s.ritirato ? <Checkbox disabled={true} /> : <Checkbox onChange={() => this.changeSelection(s)} checked={checked} />
                                                            }
                                                        </td>
                                                        <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                                        <td style={{maxWidth: 0}} className="text-truncate">{s.frequenza}%</td>
                                                        
                                                        <td>
                                                            <Tooltip title="Dettagli">
                                                                <button type="button" className="btn btn-info circle-btn" onClick={() => routerHistory.push(adminRoute+"/studenti/" + s.idStudente)}>
                                                                    <i className="fa fa-info"></i>
                                                                </button>
                                                            </Tooltip>
                                                            
                                                            {
                                                                !s.ritirato && <Tooltip title="Modifica">
                                                                    <button type="button" className="btn btn-warning text-white circle-btn ml-2" onClick={() => routerHistory.push(adminRoute+"/studenti/edit/" + s.idStudente)}>
                                                                        <i className="fa fa-pen"></i>
                                                                    </button>
                                                                </Tooltip>
                                                            }
                                                            {
                                                                !s.ritirato && <Tooltip title="Segna come ritirato">
                                                                    <button type="button" className="btn btn-danger circle-btn ml-2" onClick={() => this.showConfirm(s)}>
                                                                        <i className="fa fa-user-times"></i>
                                                                    </button>
                                                                </Tooltip>
                                                            }

                                                            {
                                                                s.ritirato && <Tooltip title="Studente ritirato">
                                                                    <button type="button" className="circle-btn ml-2 border-0">
                                                                        <i className="fa fa-user-slash"></i>
                                                                    </button>
                                                                </Tooltip>
                                                            }
                                                            
                                                            <Tooltip title="Segna come promosso">
                                                                <button type="button" className="btn btn-success circle-btn ml-2" onClick={() => this.promuoviStudent(s)}>
                                                                    <i className="fa fa-user-check"></i>
                                                                </button>
                                                            </Tooltip>
                                                            
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </TabPane>
                            })
                        }
                    </Tabs>
                </TabPane>

                <TabPane  tab={<span><i className="fal fa-user-graduate fa-fw mr-1"></i> Studenti archiviati</span>} key="2">
                    <table className="table table-bordered text-center">
                        <tbody className="border-top-0">

                            <tr>
                                <th><i className="fa fa-check-circle fa-lg text-success"></i></th>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Codice Fiscale</th>
                                <th style={{width: "15%"}}>Frequenza</th>
                                <th style={{width: "20%"}}>Azioni</th>
                            </tr>
                            
                            {
                                ritirati.map(s => {

                                    return <tr>
                                        <td><i className="fa fa-check-circle fa-lg text-success"></i></td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.frequenza}%</td>
                                        
                                        <td>
                                            <Tooltip title="Dettagli">
                                                <button type="button" className="btn btn-info circle-btn" onClick={() => routerHistory.push(adminRoute+"/studenti/" + s.idStudente)}>
                                                    <i className="fa fa-info"></i>
                                                </button>
                                            </Tooltip>                                            
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </TabPane>
            </Tabs>

            <Modal title="Sposta studenti" visible={this.state.confirmModal} onCancel={this.showHideModal} cancelText="Annulla" okText="Conferma" onOk={this.moveStudents}>
                <label className="text-secondary">Scegliere l'anno in cui spostare gli studenti</label>
                <select className="custom-select" id="moveToClass">
                    <option value="1">Primo anno</option>
                    <option value="2">Secondo anno</option>
                </select>

                <Collapse bordered={false}>
                    <Panel header="Mostra studenti selezionati" key={1}>
                        { 
                            selection.map(s => {
                                return <span className="d-block">
                                    <strong>{s.nome} {s.cognome}</strong> ({s.annoFrequentazione}° anno)
                                </span>
                            })
                        }
                    </Panel>
                </Collapse>
            </Modal>
        </div>
    }
}