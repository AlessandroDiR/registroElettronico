import React from "react"
import { Modal } from "antd";
import { routerHistory } from "../..";
import { isValidData } from "../../utilities";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly gNascita: string
    readonly mNascita: string
    readonly aNascita: string
    readonly luogoNascita: string
    readonly CF: string
    readonly annoScolastico: number
}

export default class AddNewStudent extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            gNascita: "",
            mNascita: "",
            aNascita: "",
            luogoNascita: "",
            CF: "",
            annoScolastico: 1
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

    changeGiorno = (event: any) => {
        let giorno = event.target.value

        this.setState({
            gNascita: giorno
        })
    }

    changeMese = (event: any) => {
        let mese = event.target.value

        this.setState({
            mNascita: mese
        })
    }

    changeAnno = (event: any) => {
        let anno = event.target.value

        this.setState({
            aNascita: anno
        })
    }

    changeLuogo = (event: any) => {
        let luogo = event.target.value

        this.setState({
            luogoNascita: luogo
        })
    }

    changeAnnoScolastico = (event: any) => {
        let annoS = event.target.value

        this.setState({
            annoScolastico: Number(annoS)
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiStudente = () => {
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF, annoScolastico } = this.state
        let giorno = Number(gNascita),
        mese = Number(mNascita),
        anno = Number(aNascita)

        if(nome === "" || cognome === "" || gNascita === "" || mNascita === "" || aNascita === "" || luogoNascita === "" || CF === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(!isValidData(giorno, mese, anno)){
            Modal.error({
                title: "Errore!",
                content: "Data di nascita non valida."
            })

            return
        }

        if(CF.length !== 16){
            Modal.error({
                title: "Errore!",
                content: "Codice Fiscale non valido."
            })

            return
        }

        /*************************************************/
        /* CREAZIONE NUOVO STUDENTE E POI MOSTRARE MODAL */
        /*************************************************/

        Modal.success({
            title: "Complimenti!",
            content: "Studente creato con successo.",
            onOk: () => {
                routerHistory.push("/adminpanel/studenti")
            }
        })

    }

    render(): JSX.Element{
        const { nome, cognome, gNascita, mNascita, aNascita, luogoNascita, CF } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo studente</h3>

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
                        <label className="text-secondary">Giorno nascita</label>
                        <input type="text" className="form-control" maxLength={2} value={gNascita} onChange={this.changeGiorno} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Mese nascita</label>
                        <input type="text" className="form-control" maxLength={2} value={mNascita} onChange={this.changeMese} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Anno nascita</label>
                        <input type="text" className="form-control" maxLength={4} value={aNascita} onChange={this.changeAnno} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Luogo di nascita</label>
                        <input type="text" className="form-control" value={luogoNascita} onChange={this.changeLuogo} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Anno frequentato</label>
                        <select onChange={this.changeAnnoScolastico} className="custom-select">
                            <option value={1}>Primo anno</option>
                            <option value={2}>Secondo anno</option>
                        </select>
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiStudente}>Aggiungi studente</button>
            </form>
        </div>
    }
}