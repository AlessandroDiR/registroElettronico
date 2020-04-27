import React from "react"
import { adminRoute, superAdminRoute, siteUrl } from "../utilities"

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

        return <div className="w-100 bg-white p-3 mt-3 rounded shadow px-2 text-center">
            <div>
                &copy; {(new Date()).getFullYear()} FITSTIC
            </div>

            <a href={siteUrl+"/#"+adminRoute} className="text-blue u-hover">Coordinatori</a> - <a href={siteUrl+"/#"+superAdminRoute} className="text-blue u-hover">Amministratori</a> - <a href={siteUrl+"/#/documentazione"} className="text-blue u-hover">Documentazione</a> - <a href={siteUrl+"/#/firmacasa"} className="text-blue u-hover">Firma da remoto</a>
        </div>
    }
}