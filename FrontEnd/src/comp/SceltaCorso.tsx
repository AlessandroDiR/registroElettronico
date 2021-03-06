import React from "react"
import { siteUrl, mountLogin, unmountLogin } from "../utilities"
import { ICorso } from "../models/ICorso"
import Axios from "axios"
import { Spin, Icon } from "antd"
import { routerHistory } from ".."
import Footer from "./Footer"

export interface IProps{}
export interface IState{
    readonly corsi: ICorso[]
}

export default class SceltaCorso extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            corsi: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/corsi").then(response => {
            let corsi = response.data as ICorso[]

            this.setState({
                corsi
            })
        })

        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    chooseCorso = (id: number) => {
        sessionStorage.setItem("corso", id.toString())
        routerHistory.push("/")
    }

    render(): JSX.Element{
        const { corsi } = this.state

        if(!corsi){
            const icon = <Icon type="loading" style={{ fontSize: 50, color: "#fff" }} spin />

            return <div className="col-12 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <div className="w-100 bg-white py-3 rounded shadow px-2 text-center">
                    <h3 className="text-center">Scegli il corso</h3>

                    {
                        corsi.map(c => {
                            return <div className="p-3 mx-2 text-center pointer corso-item d-inline-block rounded" onClick={() => this.chooseCorso(c.idCorso)}>
                                <img src={c.logo} alt="logo" height="60" />
                            </div>
                        })
                    }
                </div>

                <Footer />
            </div>
        </div>

    }
}