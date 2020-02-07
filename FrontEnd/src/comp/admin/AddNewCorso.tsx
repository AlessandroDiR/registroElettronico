import React from "react"
import { Modal, Spin, Icon, Checkbox } from "antd";
import { routerHistory } from "../..";
import { isValidData, siteUrl } from "../../utilities";
import Axios from "axios";
import { IMateria } from "../../models/IMateria";
import { ICorso } from "../../models/ICorso";

export interface IProps{}
export interface IState{
    readonly nome: string
    readonly desc: string
    readonly luogo: string
}

export default class AddNewCorso extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            desc: "",
            luogo: ""
        }
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

    aggiungiCorso = () => {
        const { nome, desc, luogo } = this.state

        if(nome === "" || desc === "" || luogo === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        /*************************************************/
        /* CREAZIONE NUOVO CORSO E POI MOSTRARE MODAL    */
        /*************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Corso creato con successo.",
            onOk: () => {
                routerHistory.push("/adminpanel/corsi")
            }
        })

    }

    render(): JSX.Element{
        const { nome, desc, luogo } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo corso</h3>

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

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiCorso}>Aggiungi corso</button>
            </form>
        </div>
    }
}