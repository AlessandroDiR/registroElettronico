import React from "react"
import { routerHistory } from ".."

export interface IProps{
    readonly inMenu?: boolean
}
export interface IState{}

export default class Footer extends React.PureComponent<IProps, IState>{
    render(): JSX.Element{
        if(this.props.inMenu){
            return <div className="copyright">
                &copy; {(new Date()).getFullYear()} FITSTIC - <span className="link-white u-hover" onClick={() => routerHistory.push("/documentazione")}>Documentazione</span>
            </div>
        }

        return <div className="w-100 bg-white p-3 mt-3 rounded shadow px-2 text-center">
            &copy; {(new Date()).getFullYear()} FITSTIC - <span className="link-blue u-hover" onClick={() => routerHistory.push("/documentazione")}>Documentazione</span>
        </div>
    }
}