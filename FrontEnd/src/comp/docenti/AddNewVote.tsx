import React from "react"
import { Modal } from "antd";
import { routerHistory } from "../..";
import { isValidData } from "../../utilities";
import { IStudent } from "../../models/IStudent";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly studenti: IStudent[]
    readonly nome: string
    readonly cognome: string
    readonly voto: string
}

export default class AddNewVote extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            voto: "",
            studenti: null
        }
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeVoto = (event: any) => {
        let voto = event.target.value

        this.setState({
            voto: voto
        })
    }    

    aggiungiVoto= () => {
        const { nome, cognome, voto } = this.state

        if(nome === "" || cognome === "" || voto === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

           return
        }        

        /*************************************************/
        /* CREAZIONE NUOVO STUDENTE E POI MOSTRARE MODAL */
        /*************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Voto aggiunto con successo.",
            onOk: () => {
                routerHistory.push("/docentipanel/studenti")
            }
        })

    }

    render(): JSX.Element{
        const { nome, cognome, voto } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un voto</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Voto</label>
                        <input type="text" className="form-control" maxLength={2} value={voto} onChange={this.changeVoto} />
                    </div>   
                </div>             
                
                

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiVoto}>Aggiungi studente</button>
            </form>
        </div>
    }
}