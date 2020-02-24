import React from "react"
import { Tooltip, Spin, Icon, Modal, message } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";
import { IMateria } from "../../models/IMateria";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly materie: IMateria[]
    readonly showModal: boolean
    readonly nomeMateria: string
    readonly showEditModal: boolean
    readonly materiaEdit: IMateria
    readonly nomeEdit: string
    readonly descEdit: string
    readonly descMateria: string
}

export default class MaterieList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            materie: null,
            showModal: false,
            nomeMateria: "",
            descMateria: "",
            showEditModal: false,
            materiaEdit: null,
            nomeEdit: "",
            descEdit: ""
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/materie/getmateriebycorso/" + this.props.corso).then((response) => {
            this.setState({
                materie: response.data as IMateria[]
            })
        })
    }

    showHideModal = () => {
        this.setState({
            showModal: !this.state.showModal,
            nomeMateria: "",
            descMateria: ""
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
            descEdit: materia.descrizione,
            materiaEdit: materia
        })
    }

    aggiungiMateria = () => {
        const { nomeMateria, descMateria } = this.state

        if(nomeMateria === "" || descMateria === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

           return
        }

        Axios.post(siteUrl+"/api/materie/"+this.props.corso, {
            nome: nomeMateria,
            descrizione: descMateria
        }).then(response => {
            let materie = response.data as IMateria[]

            this.setState({
                materie: materie

            })

            message.success("Materia aggiunta con successo!")

        })

    }

    modificaMateria = () => {
        const { nomeEdit, materiaEdit, descEdit } = this.state

        if(nomeEdit === "" || descEdit === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

           return
        }
        
        this.setState({
            materie: null,
            showEditModal: false
        })

        Axios.put(siteUrl+"/api/materie/"+materiaEdit.idMateria, {
            idMateria: materiaEdit.idMateria,
            nome: nomeEdit,
            descrizione: descEdit
        }).then(response => {
            let materie = response.data as IMateria[]

            this.setState({
                materie: materie,
                materiaEdit: null,
                nomeEdit: "",
                descEdit: ""
            })

            message.success("Materia modificata con successo!")
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

    changeDesc = (event: any) => {
        let desc = event.target.value

        this.setState({
            descMateria: desc
        })
    }

    changeDescEdit = (event: any) => {
        let desc = event.target.value

        this.setState({
            descEdit: desc
        })
    }

    render(): JSX.Element{
        const { materie, nomeMateria, showModal, showEditModal, materiaEdit, nomeEdit, descMateria, descEdit } = this.state
        
        if(!materie){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lista delle materie</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={this.showHideModal}>
                <i className="fal fa-plus"></i> Aggiungi materia
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Descrizione</th>
                            <th style={{width: "10%"}}>Azioni</th>
                        </tr>

                        {
                            materie.map(m => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{m.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{m.descrizione}</td>
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

            <Modal title="Aggiungi una materia" visible={showModal} onCancel={this.showHideModal} cancelText="Annulla" okText="Aggiungi" onOk={this.aggiungiMateria}>
                <div className="form-group">
                    <label className="text-secondary">Nome della materia</label>
                    <input type="text" value={nomeMateria} onChange={this.changeNome} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-secondary">Descrizione della materia</label>
                    <input type="text" value={descMateria} onChange={this.changeDesc} className="form-control" />
                </div>
            </Modal>

            {
                materiaEdit && <Modal title="Modifica di una materia" visible={showEditModal} onCancel={this.hideEditModal} cancelText="Annulla" okText="Modifica" onOk={this.modificaMateria}>
                    <div className="form-group">
                        <label className="text-secondary">Nome della materia</label>
                        <input type="text" value={nomeEdit} onChange={this.changeNomeEdit} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="text-secondary">Descrizione della materia</label>
                        <input type="text" value={descEdit} onChange={this.changeDescEdit} className="form-control" />
                    </div>
                </Modal>
            }
        </div>
    }
}