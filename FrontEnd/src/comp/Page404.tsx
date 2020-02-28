import React from "react"
import { routerHistory } from ".."

export interface IProps{
    readonly goTo: string
}
export interface IState{}

export default class Page404 extends React.PureComponent<IProps, IState>{
    render(): JSX.Element{
        return <div id="mainBlock" className="col">
            <div className="text-center text-grey w-100">
                <i className="fal fa-exclamation-triangle mb-2" style={{ fontSize: 150}}></i>
                <h1 className="mb-2 text-grey font-weight-normal">Errore 404</h1>
                <p style={{ fontSize: 20 }}>La pagina che stati cercando non esiste.</p>
                <button onClick={() => routerHistory.push(this.props.goTo)} type="button" className="btn btn-blue btn-lg text-uppercase">
                    <i className="fa fa-shield-check fa-lg fa-fw mr-2"></i>
                    Torna al sicuro
                </button>
            </div>
        </div>
    }
}