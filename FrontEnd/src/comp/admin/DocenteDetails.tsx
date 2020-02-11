import React from 'react';
import { RouteComponentProps } from 'react-router';
import { routerHistory } from '../..';
import { Icon, Spin } from 'antd';
import Axios from 'axios';
import { IDocente } from '../../models/IDocente';
import LezioniDocenteTable from './LezioniDocenteTable';
import { formattaData, siteUrl } from '../../utilities';

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly docente: IDocente
}

export default class DocenteDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            docente: null
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        /****************************************************/
        /* CARICAMENTO DATI DOCENTE (REDIRECT SE NON ESISTE) */
        /* CONTROLLARE ANCHE SE FA PARTE DEL CORSO          */
        /****************************************************/

        Axios.get(siteUrl+"/api/docenti/GetDocentiById/" + id).then((response) => {
            this.setState({
                docente: response.data as IDocente
            })
        })
    }

    render(): JSX.Element{
        const { docente } = this.state

        if(!docente){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <div className="col-5 mr-4 p-3 bg-white border" style={{borderRadius: 5}}>
                <h4 className="text-uppercase mb-2 text-truncate">{docente.nome} {docente.cognome}</h4>
                <p className="mb-0"><strong>Codice Fiscale</strong>: {docente.cf}</p>
                <p className="mb-0"><strong>Nascita</strong>: {docente.luogoNascita}, {formattaData(docente.dataNascita)}</p>
                <p className="mb-0"><strong>E-mail</strong>: {docente.email}</p>
            </div>

            <h3 className="my-3">Lezioni tenute dal docente</h3>
            <LezioniDocenteTable docente={docente.idDocente} />
        </div>
    }
}