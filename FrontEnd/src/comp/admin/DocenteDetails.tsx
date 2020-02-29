import React from 'react'
import { RouteComponentProps } from 'react-router'
import { routerHistory } from '../..'
import { Icon, Spin, Modal, Button, Statistic } from 'antd'
import Axios from 'axios'
import { IDocente } from '../../models/IDocente'
import LezioniDocenteTable from './LezioniDocenteTable'
import { siteUrl } from '../../utilities'
import { Cipher } from '../../models/Cipher'
import QRCode from "qrcode.react"


export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly docente: IDocente
    readonly modal: boolean
}

export default class DocenteDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            docente: null,
            modal: false
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        Axios.get(siteUrl+"/api/docenti/getdocentibyid/" + id).then((response) => {
            this.setState({
                docente: response.data as IDocente
            })
        })
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    downloadQR = () => {
        const { docente } = this.state,
        canvas = document.getElementById("qr-code-image") as any
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        let downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = `qrcode${docente.nome}${docente.cognome}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    getQRCode = () => {
        const { docente } = this.state
        let cipher = new Cipher(),
        code = cipher.encode(docente.cf)

        return code
    }

    render(): JSX.Element{
        const { docente, modal } = this.state

        if(!docente){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-12 col-md-6 pl-md-0 mb-2 mb-md-0">

                    <div className="p-3 bg-white border">
                        {
                            docente.ritirato && <span className="border-text">Ritirato</span>
                        }

                        <h4 className="text-uppercase mb-2 text-truncate">{docente.nome} {docente.cognome}</h4>
                        <p className="mb-0"><strong>E-mail</strong>: {docente.email}</p>
                        <Button onClick={this.toggleModal} className="float-right" type="link">
                            Mostra codice QR
                        </Button>
                        <div className="clearfix"></div>
                    </div>
                </div>

                <div className="col-12 col-md-3 pr-md-0">
                    <div className="p-3 bg-white border rounded text-center" style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Statistic title="Ore svolte" value={docente.monteOre} />
                    </div>
                </div>
            </div>

            <h3 className="mt-3">Lezioni tenute dal docente</h3>
            <LezioniDocenteTable idDocente={docente.idDocente} />

            <Modal visible={modal} maskClosable={true} centered title={
                <span>
                    <i className="far fa-qrcode fa-fw fa-lg text-primary mr-2"></i>Codice QR del docente
                </span>
            } onCancel={this.toggleModal} width={350} onOk={this.downloadQR}
            footer={[
                <Button type="primary" onClick={this.downloadQR}>
                    <i className="far fa-arrow-to-bottom mr-2"></i> Salva codice
                </Button>,
                <Button type="default" onClick={this.toggleModal}>Chiudi</Button>
            ]}>
                <div className="text-center">
                    <p>Salva il codice sottostante e condividilo con <strong>{docente.nome} {docente.cognome}.</strong></p>
                    <div className="my-2">
                        <QRCode id="qr-code-image" value={this.getQRCode()} size={200} />
                    </div>
                </div>
            </Modal>
        </div>
    }
}