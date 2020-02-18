import React from "react"
import { routerHistory } from ".."

export default class Page404 extends React.Component{
    render(): JSX.Element{
        return <div id="mainBlock" style={{ backgroundColor: "#f1f1f1" }}>
            <div className="text-center text-secondary w-100">
                <i className="fal fa-exclamation-triangle mb-2" style={{ fontSize: 150}}></i>
                <h1 className="mb-2 text-secondary">Errore 404</h1>
                <p style={{ fontSize: 20 }}>La pagina che stai cercando di raggiungere non esiste.</p>
                <button onClick={() => routerHistory.push("/")} type="button" className="btn btn-secondary btn-lg text-uppercase">
                    <i className="fa fa-shield-check fa-lg fa-fw mr-2"></i>
                    Torna al sicuro
                </button>
            </div>
        </div>
    }
}