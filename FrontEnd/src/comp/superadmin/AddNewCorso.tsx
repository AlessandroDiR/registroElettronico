import React from "react"
import { Modal, Upload, Icon, message } from "antd"
import { routerHistory } from "../.."
import { imageFileToBase64, superAdminRoute } from "../../utilities"

export interface IProps{}
export interface IState{
    readonly nome: string
    readonly descrizione: string
    readonly luogo: string
    readonly logo: string
}

export default class AddNewCorso extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            descrizione: "",
            luogo: "",
            logo: null
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
            descrizione: desc
        })
    }

    changeLuogo = (event: any) => {
        let luogo = event.target.value

        this.setState({
            luogo: luogo
        })
    }

    aggiungiCorso = () => {
        const { nome, descrizione, luogo, logo } = this.state

        if(nome === "" || descrizione === "" || luogo === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        // TRIM DATI

        /*************************************************/
        /* CREAZIONE NUOVO CORSO E POI MOSTRARE MODAL    */
        /*************************************************/

        message.success("Corso creato con successo!")
        routerHistory.push(superAdminRoute+"/corsi")

    }

    convertImage = (file: any) => {
        imageFileToBase64(file).then(result => {
            this.setState({
                logo: String(result)
            })
        })

        return false
    }

    render(): JSX.Element{
        const { nome, descrizione, luogo, logo } = this.state,
        uploadButton = (
            <div>
                <Icon type="plus" style={{ fontSize: 30, marginBottom: 5 }} />
                <div className="ant-upload-text">Carica immagine</div>
            </div>
        )

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo corso</h3>

            <form className="row">

                <div className="form-group mr-3">
                    <label className="text-secondary d-block">Logo</label>
                    <Upload listType="picture-card" showUploadList={false} beforeUpload={(file) => this.convertImage(file)} className="logo-upload" accept="image/*">
                        {logo ? <img src={logo} alt="logo" style={{ width: "100%" }} /> : uploadButton}
                    </Upload>
                </div>
                
                <div className="col">
                    <div className="form-group row">
                        <div className="col">
                            <label className="text-secondary">Nome</label>
                            <input name="nomecorso" type="text" className="form-control" value={nome} onChange={this.changeNome} />
                        </div>
                        <div className="col pr-0">
                            <label className="text-secondary">Luogo</label>
                            <input name="luogo" type="text" className="form-control" value={luogo} onChange={this.changeLuogo} />
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col pr-0">
                            <label className="text-secondary">Breve descrizione</label>
                            <textarea name="description" className="form-control" rows={2} onChange={this.changeDesc}>{descrizione}</textarea>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiCorso}>Aggiungi corso</button>
            </form>
        </div>
    }
}