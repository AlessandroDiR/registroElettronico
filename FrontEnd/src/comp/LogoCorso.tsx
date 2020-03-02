import React from "react"
import { Icon, Spin } from "antd"
import Axios from "axios"
import { siteUrl, logoUrl } from "../utilities"
import { ICorso } from "../models/ICorso"

export interface IProps{
    readonly idCorso?: string | number
}
export interface IState{
    readonly logo: string
}

export default class LogoCorso extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            logo: null
        }
    }

    catchNull = () => {
        this.setState({
            logo: logoUrl
        })
    }

    componentDidMount = () => {
        if(!this.props.idCorso){
            this.catchNull()
            return
        }
        
        Axios.get(siteUrl+"/api/corsi/"+this.props.idCorso).then(response => {
            let corso = response.data as ICorso

            if(!corso.logo){
                this.catchNull()
                return
            }

            this.setState({
                logo: corso.logo
            })
        }).catch(_ =>{
            this.catchNull()
        })
    }

    render(): JSX.Element{
        const { logo } = this.state
        
        if(!logo){
            const icon = <Icon type="loading" style={{ fontSize: 50, color: "#fff" }} spin />

            return <div className="text-center py-4">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="logo-block px-3 py-4">
            <img src={logo} height="100" className="mx-auto d-block logo" alt="logo" />
        </div>
    }
}