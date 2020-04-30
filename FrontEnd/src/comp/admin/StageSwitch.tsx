import React from "react"
import { Switch } from "antd"
import { siteUrl } from "../../utilities"
import { askPassword } from "../AskConferma"
import Axios from "axios"

export interface IProps{
    readonly idCorso: number
    readonly anno: number
}
export interface IState{
    readonly stage: boolean
    readonly loading: boolean
}

export default class StageSwitch extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            stage: false,
            loading: false
        }
    }

    componentDidMount = () => {
        const { idCorso, anno } = this.props

        this.toggleLoading()

        Axios.get(siteUrl+"/api/corsi/getstagevalue/"+idCorso+"/"+anno).then(response => {
            let status = response.data as boolean

            this.setState({
                stage: status
            })

            this.toggleLoading()
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    switchStage = () => {
        this.toggleLoading()

        askPassword(siteUrl+"/api/corsi/switchabilitastage", "post", {
            anno: this.props.anno
        }, (response: any) => {
            let message = response.data

            if(message === "success"){
                this.toggleLoading()

                this.setState({
                    stage: !this.state.stage
                })
            }
        })
    }

    render(): JSX.Element{
        const { stage, loading } = this.state

        return <label className="pointer mb-3">
            <Switch loading={loading} onChange={this.switchStage} checked={stage} className="mr-1 align-top" /> Attiva lo stage per questa classe
        </label>
    }
}