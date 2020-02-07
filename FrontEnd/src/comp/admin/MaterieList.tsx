import React from "react"
import { Tooltip, Spin, Icon, Modal } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";
import { IMateria } from "../../models/IMateria";

export interface IProps{}
export interface IState{
    readonly materie: IMateria[]
    readonly showModal: boolean
    readonly nomeMateria: string
    readonly showEditModal: boolean
    readonly materiaEdit: IMateria
    readonly nomeEdit: string
}

export default class MaterieList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            materie: null,
            showModal: false,
            nomeMateria: "",
            showEditModal: false,
            materiaEdit: null,
            nomeEdit: ""
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/reg/api?materie").then((response) => {
            this.setState({
                materie: response.data as IMateria[]
            })
        })
    }

    showHideModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    hideEditModal = () => {
        this.setState({
            showEditModal: false,
            nomeEdit: "",
            materiaEdit: null
            
        })
    }

    showEditModal = (materia: IMateria) => {
        this.setState({
            showEditModal: true,
            nomeEdit: materia.nome,
            materiaEdit: materia
        })
    }

    aggiungiMateria = () => {
        const { nomeMateria } = this.state

        if(nomeMateria === ""){
            Modal.error({
                title: "Errore!",
                content: "Scrivere un nome per la materia."
            })

           return
        }        

        /************************************************/
        /* CREAZIONE MATERIA E POI MOSTRARE MODAL       */
        /* RITORNARE LISTA AGGIORNATA MATERIE           */
        /************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Materia aggiunta con successo.",
            onOk: () => {
                this.showHideModal()
                this.setState({
                    nomeMateria: ""
                })
            }
        })

    }

    modificaMateria = () => {
        const { nomeEdit } = this.state

        if(nomeEdit === ""){
            Modal.error({
                title: "Errore!",
                content: "Scrivere un nome per la materia."
            })

           return
        }        

        /************************************************/
        /* MODIFICA MATERIA E POI MOSTRARE MODAL        */
        /* RITORNARE LISTA AGGIORNATA MATERIE           */
        /************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Materia modificata con successo.",
            onOk: () => {
                this.hideEditModal()
            }
        })

    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nomeMateria: nome
        })
    }

    changeNomeEdit = (event: any) => {
        let nome = event.target.value

        this.setState({
            nomeEdit: nome
        })
    }

    render(): JSX.Element{
        const { materie, nomeMateria, showModal, showEditModal, materiaEdit, nomeEdit } = this.state
        
        if(!materie){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lista delle materie</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={this.showHideModal}>
                <i className="fal fa-plus"></i> Aggiungi materia
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome della materia</th>
                            <th style={{width: "10%"}}>Azioni</th>
                        </tr>

                        {
                            materie.map(m => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{m.nome}</td>
                                    <td>
                                        <Tooltip title="Modifica">
                                            <button type="button" className="btn btn-warning text-white circle-btn" onClick={() => this.showEditModal(m)}>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
            </table>

            <Modal title="Aggiungi una materia" visible={showModal} onCancel={this.showHideModal} cancelText="Annulla" okText="Conferma" onOk={this.aggiungiMateria}>
                <label className="text-secondary">Nome della materia</label>
                <input type="text" value={nomeMateria} onChange={this.changeNome} className="form-control" />
            </Modal>

            {
                materiaEdit && <Modal title="Modifica di una materia" visible={showEditModal} onCancel={this.hideEditModal} cancelText="Annulla" okText="Conferma" onOk={this.modificaMateria}>
                    <label className="text-secondary">Nome della materia</label>
                    <input type="text" value={nomeEdit} onChange={this.changeNomeEdit} className="form-control" />
                </Modal>
            }
        </div>
    }
}