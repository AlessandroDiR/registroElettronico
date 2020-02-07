import React from "react"
import { IStudent } from "../../models/IStudent";
import { routerHistory } from "../..";
import { Tooltip, Spin, Icon, Modal } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly students: IStudent[]
    readonly selectedStudente: IStudent
    readonly confirmModal: boolean
    readonly voto: string
}

export default class StudentsList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            students: null,
            confirmModal: false,
            selectedStudente: null,
            voto: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/reg/api?studenti&corso=" + this.props.corso).then((response) => {
            this.setState({
                students: response.data as IStudent[]
            })
        })
    }

    showHideModal = (studente: IStudent) => {
        this.setState({
            confirmModal: !this.state.confirmModal,
            selectedStudente: studente
        })
    }

    aggiungiVoto = () => {
        const { voto } = this.state
        let n = parseInt(voto)

        if(voto === "" || isNaN(n) || n < 0 || n > 100){
            Modal.error({
                title: "Errore!",
                content: "Voto non valido."
            })

           return
        }        

        /*************************************************/
        /* CREAZIONE VOTO STUDENTE E POI MOSTRARE MODAL  */
        /* RITORNARE LISTA AGGIORNATA STUDENTI           */
        /*************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Voto aggiunto con successo.",
            onOk: () => {
                this.showHideModal(null)
            }
        })

    }

    changeVoto = (event: any) => {
        let voto = event.target.value

        this.setState({
            voto: voto
        })
    }

    render(): JSX.Element{
        const { students, voto, selectedStudente } = this.state
        
        if(!students){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }
        
        let firstYear = students.filter(s => s.annoIscrizione === 2018),
        secondYear = students.filter(s => s.annoIscrizione === 2019),
        groups = [firstYear, secondYear]

        console.log(groups)

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Studenti del corso</h3>

            <table className="table table-bordered text-center">
                
                {
                    groups.map(g => {
                        return <tbody className="border-top-0">
                            
                            <tr className="thead-light">
                                <th colSpan={7}>
                                    { g[0].annoIscrizione === 2018 ? "Primo" : "Secondo" } anno
                                </th>
                            </tr>

                            <tr>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Codice Fiscale</th>
                                <th>Corso</th>
                                <th style={{width: "18%"}}>Anno scolastico</th>
                                <th style={{width: "15%"}}>Azioni</th>
                            </tr>
                
                            {
                                g.map(s => {            
                                    return <tr>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.idCorso}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.annoIscrizione}-{s.annoIscrizione + 1}</td>
                                        <td>
                                            <Tooltip title="Aggiungi voto">
                                                <button type="button" className="btn btn-success text-white circle-btn mr-2" onClick={() => this.showHideModal(s)}>
                                                    <i className="fal fa-plus"></i>
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Lista voti">
                                                <button type="button" className="btn btn-info text-white circle-btn" onClick={() => routerHistory.push("/docentipanel/studenti/" + s.idStudente)}>
                                                    <i className="fa fa-stars"></i>
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

            {
                selectedStudente && <Modal title={"Aggiungi un voto allo studente: " + selectedStudente.nome + " " + selectedStudente.cognome} visible={this.state.confirmModal} onCancel={() => this.showHideModal(null)} cancelText="Annulla" okText="Conferma" onOk={this.aggiungiVoto}>
                    <label className="text-secondary">Voto</label>
                    <input type="text" value={voto} onChange={this.changeVoto} maxLength={3} className="form-control" />
                </Modal>
            }
        </div>
    }
}