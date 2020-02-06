import React from "react"
import { Icon, Spin } from "antd"
import { IVoti } from "../../models/IVoti"

export interface IProps{
    readonly studente: number
}
export interface IState{
    readonly voti: IVoti[]
}


export default class VotiStudent extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            voti: [{
                docente: "Brizio",
                materia: "Databees",
                voto: 0,
                data: "03/02/2020",
            },{
                docente: "Fabrizio",
            materia: "Matematica",
            voto: 2,
            data: "04/02/2020",
            }]
        }
    }

    componentDidMount = () => {
        /*******************************/
        /* CARICAMENTO PRESENZE UTENTE */
        /*******************************/
    }
    

    render(): JSX.Element{
        const { voti } = this.state

        if(!voti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <table className="table table-bordered text-center mt-3">
            <tbody>
                <tr className="thead-light">
                    <th>Docente</th>
                    <th>Materia</th>
                    <th>Voto</th>
                    <th>Data</th>
                </tr>

                {
                    voti.map(p => {
                        return <tr>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.docente}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.materia}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.voto}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.data}</td>
                            
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}