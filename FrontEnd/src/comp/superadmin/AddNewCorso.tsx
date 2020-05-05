import React from "react"
import { Modal, Upload, Icon, message } from "antd"
import { routerHistory } from "../.."
import { imageFileToBase64, superAdminRoute, siteUrl } from "../../utilities"
import { askPassword } from "../AskConferma"

export interface IProps{}
export interface IState{
    readonly nome: string
    readonly luogo: string
    readonly logo: string
}

export default class AddNewCorso extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            luogo: "",
            logo: null
        }
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome
        })
    }

    changeLuogo = (event: any) => {
        let luogo = event.target.value

        this.setState({
            luogo
        })
    }

    aggiungiCorso = (e: any) => {
        e.preventDefault()

        const { nome, luogo, logo } = this.state

        if(nome.trim() === "" || luogo.trim() === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        askPassword(siteUrl+"/api/corsi", "post", {
            corso: {
                nome: nome.trim(),
                luogo: luogo.trim(),
                logo: logo ? logo.trim() : ""
            }
        }, (_: any) => {
            message.success("Corso creato con successo!")
            routerHistory.push(superAdminRoute+"/corsi")
        })
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
        const { nome, luogo, logo } = this.state,
        uploadButton = (
            <div>
                <Icon type="plus" style={{ fontSize: 30, marginBottom: 5 }} />
                <div className="ant-upload-text">Carica immagine</div>
            </div>
        )

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo corso</h3>

            <form className="row" onSubmit={this.aggiungiCorso}>

                <div className="form-group mr-3">
                    <label className="text-secondary d-block">Logo</label>
                    <Upload listType="picture-card" showUploadList={false} beforeUpload={(file) => this.convertImage(file)} className="logo-upload" accept="image/*">
                        {logo ? <img src={logo} alt="logo" style={{ width: "100%" }} /> : uploadButton}
                    </Upload>
                </div>
                
                <div className="col pr-0">
                    <div className="form-group">
                        <label className="text-secondary">Nome</label>
                        <input name="nomecorso" type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="form-group">
                        <label className="text-secondary">Luogo</label>
                        <input name="luogo" type="text" className="form-control" value={luogo} onChange={this.changeLuogo} />
                    </div>
                </div>
                <button type="submit" className="btn btn-success text-uppercase w-100">Aggiungi corso</button>
            </form>
        </div>
    }
}