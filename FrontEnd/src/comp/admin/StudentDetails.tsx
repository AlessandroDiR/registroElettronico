import React from "react"
import { RouteComponentProps } from "react-router"
import { IStudent } from "../../models/IStudent"
import { routerHistory } from "../.."
import { Icon, Spin, Progress, Statistic, Modal, Button } from "antd"
import PresenzeTable from "./PresenzeTable"
import Axios from "axios"
import { formatItalian, siteUrl, adminRoute } from "../../utilities"
import QRCode from "qrcode.react"

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly student: IStudent
    readonly totPresenze: number
    readonly oreTotali: number
    readonly modal: boolean
}

export default class StudentDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            student: null,
            totPresenze: null,
            oreTotali: null,
            modal: false
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push(adminRoute)

        Axios.get(siteUrl+"/api/studenti/getstudentibyid/" + id).then(response => {
            this.setState({
                student: response.data as IStudent
            })
        })

        Axios.get(siteUrl+"/api/studenti/gettotaleorelezioni/" + id).then(response => {
            this.setState({
                oreTotali: response.data as number
            })
        })

        this.loadTotali()
    }

    loadTotali = () => {
        this.setState({
            totPresenze: null
        })

        Axios.get(siteUrl+"/api/studenti/gethoursamount/" + this.props.match.params.id).then(response => {
            this.setState({
                totPresenze: response.data as number
            })
        })
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    downloadQR = () => {
        const { student } = this.state,
        canvas = document.getElementById("qr-code-image") as any
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        let downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = `qrcode${student.nome}${student.cognome}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    getQRCode = () => {
        const { student } = this.state

        return student.codice
    }

    render(): JSX.Element{
        const { student, totPresenze, oreTotali, modal } = this.state
        
        if(!student){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        let perc = student.frequenza !== null ? Math.round(100 * totPresenze / oreTotali) : null,
        color = perc >= 80 ? "var(--success)" : "var(--danger)"

        return <div className="col px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-12 col-md-6 pl-md-0 mb-2 mb-md-0">
                    <div className="p-3 bg-white border rounded">
                        <span className="border-text">
                            {
                                student.ritirato ? "Ritirato: " + formatItalian(student.dataRitiro) : student.annoFrequentazione === 1 ? "Primo anno" : "Secondo anno"
                            }
                        </span>
                        <h4 className="text-uppercase mb-2 text-truncate">{student.nome} {student.cognome}</h4>
                        <p className="mb-0"><strong>Data di nascita</strong>: {formatItalian(student.dataNascita)}</p>
                        <p className="mb-0"><strong>E-mail</strong>: {student.email}</p>
                        <Button onClick={this.toggleModal} className="float-right" type="link">
                            Mostra codice QR
                        </Button>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="col-12 col-md-6 pr-md-0">
                    <div className="p-3 bg-white border rounded">
                        {
                            perc !== null ? <Progress type="circle" percent={perc} width={80} className="float-left mr-3" strokeColor={color} format={percent => `${percent}%`}  /> : <Spin indicator={<Icon type="loading" spin />} />
                        }

                        {
                            oreTotali !== null && totPresenze !== null ? <Statistic title="Presenze totali (ore)" value={totPresenze} suffix={"/ "+oreTotali} decimalSeparator="," groupSeparator="." /> : <Spin indicator={<Icon type="loading" spin />} />
                        }
                        
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>

            <PresenzeTable studente={student} reloadTotali={this.loadTotali} />
            
            <Modal visible={modal} maskClosable centered title={
                <span>
                    <i className="far fa-qrcode fa-fw fa-lg text-primary mr-2"></i>Codice QR dello studente
                </span>
            } onCancel={this.toggleModal} width={350} onOk={this.downloadQR}
            footer={[
                <Button type="primary" onClick={this.downloadQR}>
                    <i className="far fa-arrow-to-bottom mr-2"></i> Salva codice
                </Button>,
                <Button type="default" onClick={this.toggleModal}>Chiudi</Button>
            ]}>
                <div className="text-center">
                    <p>Salva il codice sottostante e condividilo con <strong>{student.nome} {student.cognome}.</strong></p>
                    <div className="my-2">
                        <QRCode id="qr-code-image" value={this.getQRCode()} size={200} />
                    </div>
                </div>
            </Modal>
        </div>
    }
}