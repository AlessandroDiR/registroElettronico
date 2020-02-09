import React from "react"
import { Modal, Icon, Spin } from "antd";
import { routerHistory } from "../..";
import { siteUrl } from "../../utilities";
import Axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { ICorso } from "../../models/ICorso";

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{}
export interface IState{
    readonly corso: ICorso
    readonly nome: string
    readonly desc: string
    readonly luogo: string
}

export default class EditCorso extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            corso: null,
            nome: "",
            desc: "",
            luogo: ""
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get(siteUrl+"/reg/api?corso&id=" + id).then((response) => {
            let corso = response.data as ICorso

            this.setState({
                corso: corso,
                nome: corso.nome,
                desc: corso.desc,
                luogo: corso.luogo
            })
        })
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeDesc = (event: any) => {
        let desc = event.target.value

        this.setState({
            desc: desc
        })
    }

    changeLuogo = (event: any) => {
        let luogo = event.target.value

        this.setState({
            luogo: luogo
        })
    }

    modificaCorso = () => {
        const { nome, desc, luogo } = this.state

        if(nome === "" || desc === "" || luogo === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        /***************************************/
        /* MODIFICA CORSO E POI MOSTRARE MODAL */
        /***************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Corso modificato con successo.",
            onOk: () => {
                routerHistory.push("/adminpanel/corsi")
            }
        })

    }

    render(): JSX.Element{
        const { nome, desc, luogo, corso } = this.state

        if(!corso){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di un corso</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Luogo</label>
                        <input type="text" className="form-control" value={luogo} onChange={this.changeLuogo} />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Breve descrizione</label>
                        <input type="text" className="form-control" value={desc} onChange={this.changeDesc} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.modificaCorso}>Modifica corso</button>
            </form>
        </div>
    }
}