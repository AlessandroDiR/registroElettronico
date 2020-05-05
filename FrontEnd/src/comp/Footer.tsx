import React from "react"
import { adminRoute, superAdminRoute, studentRoute, siteUrl } from "../utilities"

export interface IProps{
    readonly inMenu?: boolean
}
export interface IState{}

export default class Footer extends React.PureComponent<IProps, IState>{
    render(): JSX.Element{
        if(this.props.inMenu){
            return <div className="copyright">
                &copy; {(new Date()).getFullYear()} FITSTIC - <a href={siteUrl+"/#/documentazione"} className="text-white u-hover">Documentazione</a>
            </div>
        }

        return <div className="w-100 bg-white p-3 mt-3 shadow px-2 text-center fixed-bottom">
            <span style={{ position: "absolute", right: 20, fontSize: 32 }} role="img" aria-label="Avocado Team">🥑</span>

            <div>
                &copy; {(new Date()).getFullYear()} FITSTIC
            </div>

            <a href={siteUrl+"/#"+adminRoute} className="text-blue u-hover align-middle">Coordinatori</a> | <a href={siteUrl+"/#"+superAdminRoute} className="text-blue u-hover align-middle">Amministratori</a> | <a href={siteUrl+"/#"+studentRoute} className="text-blue u-hover align-middle">Studenti</a> | <a href={siteUrl+"/#/firmacasa"} className="text-blue u-hover align-middle">Firma da remoto</a> | <a href={siteUrl+"/#/documentazione"} className="text-blue u-hover align-middle">Documentazione</a>
        </div>
    }
}