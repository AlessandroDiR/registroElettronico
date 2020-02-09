import React from "react"
import { Tooltip, Icon, Spin, Modal } from "antd"
import { IVoti } from "../../models/IVoti"

export interface IProps{
    readonly docente: number
}
export interface IState{
    readonly voti: IVoti[]
    readonly votoEdit: IVoti
    readonly votoValueEdit: string
    readonly showEditModal: boolean
    readonly materia: string
}

export default class VotiTable extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            voti: null,
            votoEdit: null,
            votoValueEdit: "",
            showEditModal: false,
            materia: ""

        }
    }

    componentDidMount = () => {
        /*******************************/
        /* CARICAMENTO VOTI DOCENTE    */
        /*******************************/
    }

    confirmDeleteMark = (mark: number) => {
        Modal.confirm({
            title: "Attenzione!",
            content: "Confermi di voler eliminare questo voto per lo studente?",
            okText: 'Confermo',
            okType: 'danger',
            cancelText: 'Annulla',
            onOk() {
                /************************************/
                /* ELIMINAZIONE VOTO                */
                /* this.state.voti = null           */
                /* RICHIESTA AXIOS LISTA AGGIORNATA */
                /************************************/
            }
        })
    }

    showEditModal = (voto: IVoti) => {
        this.setState({
            votoValueEdit: voto.voto.toString(),
            votoEdit: voto,
            showEditModal: true,
            materia: voto.materia
        })
    }

    hideEditModal = () => {
        this.setState({
            votoValueEdit: "",
            votoEdit: null,
            showEditModal: false
        })
    }

    changeVoto = (event: any) => {
        let voto = event.target.value

        this.setState({
            votoValueEdit: voto
        })
    }

    changeMateria = (event: any) => {
        let materia = event.target.value

        this.setState({
            materia: materia
        })
    }

    modificaVoto = () => {
        const { votoValueEdit, materia } = this.state
        let numVoto = parseInt(votoValueEdit)   

        if(materia === "" || votoValueEdit === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

           return
        }  

        if(isNaN(numVoto) || numVoto < 0 || numVoto > 100){
            Modal.error({
                title: "Errore!",
                content: "Voto non valido."
            })

           return
        }      

        /**************************************/
        /* MODIFICA VOTO E POI MOSTRARE MODAL */
        /* RITORNARE LISTA AGGIORNATA VOTI    */
        /**************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Voto modificato con successo.",
            onOk: () => {
                this.hideEditModal()
            }
        })

    }

    render(): JSX.Element{
        const { voti, votoEdit, votoValueEdit, showEditModal, materia } = this.state

        if(!voti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <table className="table table-bordered text-center mt-3">
            <tbody>
                <tr className="thead-light">
                    <th>Data</th>
                    <th>Materia</th>
                    <th>Voto</th>
                    <th style={{width: "15%"}}>Azioni</th>
                </tr>

                {
                    voti.map(p => {
                        return <tr>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.data}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.materia}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.voto}</td>
                            <td>
                                <Tooltip title="Modifica voto">
                                    <button type="button" className="fa fa-pen btn btn-orange circle-btn mr-2" onClick={() => this.showEditModal(p)}></button>
                                </Tooltip>
                                <Tooltip title="Cancella voto">
                                    <button type="button" className="fa fa-trash btn btn-danger circle-btn" onClick={() => this.confirmDeleteMark(p.id)}></button>
                                </Tooltip>
                            </td>
                        </tr>
                    })
                }
            </tbody>

            {
                votoEdit && <Modal title="Modifica di una voto" visible={showEditModal} onCancel={this.hideEditModal} cancelText="Annulla" okText="Modifica" onOk={this.modificaVoto}>
                    <div className="form-group">
                        <label className="text-secondary">Materia</label>
                        <input type="text" value={materia} onChange={this.changeMateria} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="text-secondary">Voto</label>
                        <input type="text" value={votoValueEdit} maxLength={3} onChange={this.changeVoto} className="form-control" />
                    </div>
                </Modal>
            }
        </table>
    }
}