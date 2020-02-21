import React from "react"
import { Spin, Icon } from "antd";
import QRCode from "qrcode.react"
import Axios from "axios";

export interface IProps{
    studentId: number
}
export interface IState{
    readonly code: string
}

export default class QRCodeScreen extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            code: null
        }

        this.reloadCode()
    }

    componentDidMount = () => {
        setInterval(() => {
            this.setState({
                code: null
            })

            this.reloadCode()
        }, 20000)
    }

    reloadCode = () => {
        Axios.get("http://mygraphic.altervista.org/reg/api?codice&studente="+this.props.studentId).then((response) => {
            this.setState({
                code: response.data
            })
        })
    }

    render(): JSX.Element{
        const { code } = this.state

        if(!code){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <div className="text-center">
            <h5 className="mb-4 font-weight-normal text-black underline">Scannerizza questo codice</h5>
            <QRCode value={code} size={200} />
        </div>
    }
}
