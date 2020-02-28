import React from "react"
import { mountLogin, unmountLogin } from "../utilities"
import { routerHistory } from ".."

export default class SceltaClasse extends React.Component{

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    chooseClasse = (id: number) => {
        sessionStorage.setItem("classe", id.toString())
        routerHistory.push("/")
    }

    render(): JSX.Element{
        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100 bg-white py-3 rounded shadow">
                <h3 className="text-center">Scegli la classe</h3>

                <div className="py-2 text-center pointer corso-item" onClick={() => this.chooseClasse(1)}>
                    Primo anno
                </div>
                <div className="py-2 text-center pointer corso-item" onClick={() => this.chooseClasse(2)}>
                    Secondo anno
                </div>
            </div>
        </div>

    }
}