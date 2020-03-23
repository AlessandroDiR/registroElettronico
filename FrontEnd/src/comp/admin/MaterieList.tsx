import React from "react"
import { Tooltip, Spin, Icon, Modal, message, Button } from "antd"
import Axios from "axios"
import { siteUrl } from "../../utilities"
import { IMateria } from "../../models/IMateria"

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
        Axios.get(siteUrl+"/api/materie/getmateriebycorso/" + this.props.corso).then((response) => {
            this.setState({
                materie: response.data as IMateria[]
            })
        })
    }

    showHideModal = () => {
        this.setState({
            showModal: !this.state.showModal,
            nomeMateria: ""
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

    aggiungiMateria = (e: any) => {
        e.preventDefault()

        const { nomeMateria } = this.state

        if(nomeMateria.trim() === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

           return
        }
        
        this.setState({
            materie: null,
            showModal: false
        })

        Axios.post(siteUrl+"/api/materie/"+this.props.corso, {
            nome: nomeMateria.trim()
        }).then(response => {
            let materie = response.data as IMateria[]

            this.setState({
                materie: materie
            })

            message.success("Materia aggiunta con successo!")
        })

    }

    modificaMateria = (e: any) => {
        e.preventDefault()

        const { nomeEdit, materiaEdit } = this.state

        if(nomeEdit === ""){
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
            nome: nomeEdit.trim()
        }).then(response => {
            let materie = response.data as IMateria[]

            this.setState({
                materie: materie,
                materiaEdit: null,
                nomeEdit: "",
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

    render(): JSX.Element{
        const { materie, nomeMateria, showModal, showEditModal, materiaEdit, nomeEdit } = this.state
        
        if(!materie){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lista delle materie</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={this.showHideModal}>
                <i className="fal fa-plus fa-fw"></i> Aggiungi materia
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
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

            <Modal title="Aggiungi una materia" visible={showModal} footer={[
                <Button type="primary" onClick={this.aggiungiMateria}>Aggiungi</Button>,
                <Button type="default" onClick={this.showHideModal}>Annulla</Button>
            ]} onCancel={this.showHideModal}>
                <form onSubmit={this.aggiungiMateria}>
                    <div className="form-group mb-0">
                        <label className="text-secondary">Nome della materia</label>
                        <input type="text" value={nomeMateria} onChange={this.changeNome} className="form-control" />
                    </div>

                    <input type="submit" className="d-none" />
                </form>
            </Modal>

            {
                materiaEdit && <Modal title="Modifica di una materia" visible={showEditModal} footer={[
                    <Button type="primary" onClick={this.modificaMateria}>Modifica</Button>,
                    <Button type="default" onClick={this.hideEditModal}>Annulla</Button>
                ]} onCancel={this.hideEditModal}>
                    <form onSubmit={this.modificaMateria}>
                        <div className="form-group mb-0">
                            <label className="text-secondary">Nome della materia</label>
                            <input type="text" value={nomeEdit} onChange={this.changeNomeEdit} className="form-control" />
                        </div>

                        <input type="submit" className="d-none" />
                    </form>
                </Modal>
            }
        </div>
    }
}