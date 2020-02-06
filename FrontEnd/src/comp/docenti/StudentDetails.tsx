import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IStudent } from '../../models/IStudent';
import { routerHistory } from '../..';
import { Icon, Spin } from 'antd';
import Axios from 'axios';
import { siteUrl } from '../../utilities';
import VotiTable from './VotiTable';

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
    readonly idDocente: number
}
export interface IState{
    readonly student: IStudent
}

export default class StudentDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            student: null
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/docentipanel")

        /****************************************************/
        /* CARICAMENTO DATI UTENTE (REDIRECT SE NON ESISTE) */
        /* CONTROLLARE ANCHE SE FA PARTE DEL CORSO          */
        /****************************************************/

        Axios.get(siteUrl+"/reg/api?studente&id=" + id).then((response) => {
            this.setState({
                student: response.data as IStudent
            })
        })
    }

    render(): JSX.Element{
        const { student } = this.state

        if(!student){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">

            <div className="col-5 mr-4 p-3 bg-white border position-relative" style={{borderRadius: 5}}>
                <span className="border-text">{student.anno === 1 ? "Primo" : "Secondo"} anno</span>
                <h4 className="text-uppercase mb-2 text-truncate">{student.nome} {student.cognome}</h4>
            </div>

            <h3 className="my-3">Voti dello studente (assegnati da te)</h3>
            <VotiTable docente={this.props.idDocente} />
        </div>
    }
}