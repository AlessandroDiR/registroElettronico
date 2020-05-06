import React from "react"
import Axios from "axios"
import { Button, Progress, Spin, Icon, Statistic, Tooltip } from "antd"
import QRCode from "qrcode.react"
import { IStudent } from "../../models/IStudent"
import { siteUrl, avocadoUrl } from "../../utilities"

export interface IProps{
    readonly studente: IStudent
}
export interface IState{
    readonly oreTotali: number
    readonly totPresenze: number
}

export default class Home extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            oreTotali: null,
            totPresenze: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/studenti/gethoursamount/" + this.props.studente.idStudente).then(response => {
            this.setState({
                totPresenze: response.data as number
            })
        })

        Axios.get(siteUrl+"/api/studenti/gettotaleorelezioni/" + this.props.studente.idStudente).then(response => {
            this.setState({
                oreTotali: response.data as number
            })
        })
    }

    downloadQR = () => {
        const { studente } = this.props,
        canvas = document.getElementById("qr-code-image") as any,
        pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        let downloadLink = document.createElement("a")

        downloadLink.href = pngUrl
        downloadLink.download = `qrcode${studente.nome}${studente.cognome}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    render = () => {
        const { studente } = this.props,
        { oreTotali, totPresenze } = this.state

        let perc = Math.round(100 * totPresenze / oreTotali),
        color = perc >= 80 ? "var(--success)" : "var(--danger)"

        return <div className="col px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-12 col-md-4 pl-md-0 mb-2 mb-md-0">
                    <div className="p-3 bg-white border rounded">
                        <Tooltip title={studente.nome + " " + studente.cognome}>
                            <h4 className="text-uppercase mb-2 text-truncate">{studente.nome} {studente.cognome}</h4>
                        </Tooltip>

                        <div className="text-center">
                            <QRCode id="qr-code-image" value={studente.codice} size={200} imageSettings={{ src: avocadoUrl, height: 50, width: 50, excavate: true }} />
                        </div>

                        <Button type="primary" className="float-right mt-3" onClick={this.downloadQR}>
                            <i className="far fa-arrow-to-bottom mr-2"></i> Salva codice
                        </Button>

                        <div className="clearfix"></div>
                    </div>
                </div>

                <div className="col-12 col-md-5 pr-md-0">
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
        </div>
    }
}