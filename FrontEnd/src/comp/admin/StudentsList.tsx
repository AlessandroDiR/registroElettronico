import React from "react"
import { IStudent } from "../../models/IStudent";
import { routerHistory } from "../..";
import { Modal, Tooltip, Spin, Icon, Checkbox, Collapse } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly students: IStudent[]
    readonly selection: IStudent[]
    readonly confirmModal: boolean
}

const { Panel } = Collapse;

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
        Axios.get(siteUrl+"/reg/api?studenti&corso=" + this.props.corso).then((response) => {
            this.setState({
                students: response.data as IStudent[]
            })
        })
    }

    showDeleteConfirm = (student: IStudent) => {
        Modal.confirm({
            title: 'Confermi di voler eliminare questo studente dal corso? (' + student.nome + ' ' + student.cognome + ')',
            content: 'Insieme allo studente verranno cancellate anche tutte le entrate e le uscite relative allo studente.',
            okText: 'Confermo',
            okType: 'danger',
            cancelText: 'Annulla',
            onOk() {
                /************************************/
                /* ELIMINAZIONE STUDENTE            */
                /* this.state.students = null       */
                /* RICHIESTA AXIOS LISTA AGGIORNATA */
                /************************************/
            }
        })
    }

    changeSelection = (student: IStudent) => {
        let find = this.state.selection.find(s => s === student),
        newList = []

        if(find)
            newList = this.state.selection.filter(s => s.id !== student.id)
        else
            newList = this.state.selection.concat(student)

        this.setState({
            selection: newList
        })
    }

    selectAll = (anno: number, event: any) => {
        let selectionList = event.target.checked ? this.state.students.filter(s => s.anno === anno).map(s => {
            return s
        }) : []

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
        value = select.value

        /*******************************************************/
        /* SPOSTARE STUDENTI NEL NUOVO ANNO E RIFARE RICHIESTA */
        /* this.state.students = null                          */
        /* RICHIESTA AXIOS LISTA AGGIORNATA                    */
        /*******************************************************/

        this.showHideModal()
    }

    render(): JSX.Element{
        const { students, selection } = this.state
        
        if(!students){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }
        
        let firstYear = students.filter(s => s.anno === 1),
        secondYear = students.filter(s => s.anno === 2),
        groups = [firstYear, secondYear]

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Studenti del corso</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push("/adminpanel/studenti/new")}>
                <i className="fal fa-plus"></i> Aggiungi studente
            </button>

            <button className="btn btn-orange float-right mb-3 mr-2" type="button" onClick={this.showHideModal}>
                <i className="fa fa-arrows-alt"></i> Sposta studenti
            </button>

            <button className="btn btn-primary float-right mb-3 mr-2" type="button" onClick={() => routerHistory.push("/adminpanel/studenti/import")}>
                <i className="fa fa-file-csv"></i> Importa da CSV
            </button>

            <table className="table table-bordered text-center">
                
                
                {
                    groups.map(g => {
                        let checkedAll = false

                        g.forEach(element => {
                            checkedAll = selection.indexOf(element) !== -1
                        })

                        return <tbody className="border-top-0">
                            
                            <tr className="thead-light">
                                <th colSpan={7}>
                                    { g[0].anno === 1 ? "Primo" : "Secondo" } anno
                                </th>
                            </tr>

                            <tr>
                                <th style={{width: "5%"}}>
                                    <Tooltip title="Seleziona tutti">
                                        <Checkbox onChange={(e) => this.selectAll(g[0].anno, e)} checked={checkedAll} />
                                    </Tooltip>
                                </th>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Codice Fiscale</th>
                                <th>Corso</th>
                                <th style={{width: "18%"}}>Anno scolastico</th>
                                <th style={{width: "20%"}}>Azioni</th>
                            </tr>
                
                            {
                                g.map(s => {
                                    let checked = this.state.selection.find(n => n === s) ? true : false
            
                                    return <tr>
                                        <td>
                                            <Checkbox onChange={() => this.changeSelection(s)} checked={checked} />
                                        </td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.corso}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.anno}-{s.anno + 1}</td>
                                        <td>
                                            <Tooltip title="Dettagli">
                                                <button type="button" className="btn btn-info circle-btn mr-2" onClick={() => routerHistory.push("/adminpanel/studenti/" + s.id)}>
                                                    <i className="fa fa-info"></i>
                                                </button>
                                            </Tooltip>

                                            <Tooltip title="Modifica">
                                                <button type="button" className="btn btn-warning text-white circle-btn mr-2" onClick={() => routerHistory.push("/adminpanel/studenti/edit/" + s.id)}>
                                                    <i className="fa fa-pen"></i>
                                                </button>
                                            </Tooltip>
                                            
                                            <Tooltip title="Elimina">
                                                <button type="button" className="btn btn-danger circle-btn" onClick={() => this.showDeleteConfirm(s)}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    })
                }
            </table>

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
                                    <strong>{s.nome} {s.cognome}</strong> ({s.anno}° anno)
                                </span>
                            })
                        }
                    </Panel>
                </Collapse>
            </Modal>
        </div>
    }
}