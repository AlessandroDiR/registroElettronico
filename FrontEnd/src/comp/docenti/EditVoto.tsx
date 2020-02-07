import React from "react"
import { Modal, Icon, Spin } from "antd";
import { routerHistory } from "../..";
import { getDateDay, getDateMonth, getDateYear, isValidData, siteUrl } from "../../utilities";
import { IDocente } from "../../models/IDocente";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { IVoti } from "../../models/IVoti"

export interface IRouteParams {
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams> {
    readonly corso: number
}
export interface IState {
    readonly voti: IVoti
}

export default class EditVoto extends React.PureComponent<IProps, IState>{

    constructor(props: IProps) {
        super(props)

        this.state = {
            voti: {
                id:1,
                docente: "Brizio",
                materia: "Databees",
                voto: 0,
                data: "03/02/2020",
            }
        }
    }

    componentDidMount = () => {
    
    }

    changeVoto = (event: any) => {
        let voto = event.target.value

        this.setState({
            voti: voto
        })
    }

    modificaVoto = () => {
        const { voti } = this.state

        if (!voti) {
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }
    
        /******************************************/
        /* MODIFICA VOTO E POI MOSTRARE MODAL */
        /*****************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Voto modificato con successo.",
            onOk: () => {
                routerHistory.push("/docentipanel/studenti")
            }
        })
    }     
    
    render(): JSX.Element {
        const { voti } = this.state

        if (!voti) {
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di un voto</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Voto</label>
                        <input type="text" className="form-control" value={voti.voto} onChange={this.changeVoto} />
                    </div>
                </div>

                    <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.modificaVoto}>Modifica Voto</button>
                
            </form>
        </div>
     }
}
