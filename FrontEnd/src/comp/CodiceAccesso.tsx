import React from "react"
import { mountLogin, unmountLogin } from "../utilities"
import { routerHistory } from ".."

export interface IProps{
    readonly idCorso: number
}
export interface IState{
    readonly codice: string
}
export default class CodiceAccesso extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            codice: ""
        }
    }

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    cambiaCodice = (e: any) => {
        let codice = e.target.value

        this.setState({
            codice: codice
        })
    }

    inviaCodice = (e: any) => {
        e.preventDefault()

        sessionStorage.setItem("confermaTutor", "true")
        routerHistory.push("/")
    }

    render(): JSX.Element{
        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaCodice}>
                <h3 className="text-center">Conferma coordinatore</h3>

                <div className="form-group">
                    <label className="text-secondary">Codice di conferma</label>
                    <input name="codice" type="password" className="form-control" value={this.state.codice} onChange={this.cambiaCodice} />
                </div>

                <input type="submit" value="Prosegui" className="btn btn-lg btn-success w-100 text-uppercase"/>
            </form>
        </div>

    }
}