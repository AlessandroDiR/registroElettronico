import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IStudent } from '../../models/IStudent';
import { routerHistory } from '../..';
import { Icon, Spin, Progress, Statistic } from 'antd';
import PresenzeTable from './PresenzeTable';
import Axios from 'axios';
import { formattaData, siteUrl, fixTotPresenze } from '../../utilities';

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly student: IStudent
    readonly totPresenze: string
}

export default class StudentDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            student: null,
            totPresenze: null
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

        /****************************************************/
        /* CARICAMENTO DATI UTENTE (REDIRECT SE NON ESISTE) */
        /* CONTROLLARE ANCHE SE FA PARTE DEL CORSO          */
        /****************************************************/

        Axios.get(siteUrl+"/api/studenti/getstudentibyid/" + id).then((response) => {
            this.setState({
                student: response.data as IStudent
            })
        })

        Axios.get(siteUrl+"/api/studenti/gethoursamount/" + id).then((response) => {
            this.setState({
                totPresenze: response.data as string
            })
        })
    }

    roundToTwo = (total: number, current: number) => {    
        return Number((Math.round((100 * current / total) * 100) / 100));
    }

    render(): JSX.Element{
        const { student, totPresenze } = this.state

        if(!student || !totPresenze){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        let tot = fixTotPresenze(totPresenze).toFixed(2),
        perc = this.roundToTwo(2000, Number(tot)),
        color = perc >= 80 ? "var(--success)" : "var(--danger)"

        return <div className="col-9 px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-5 mr-4 p-3 bg-white border position-relative" style={{borderRadius: 5}}>
                    <span className="border-text">{student.annoIscrizione === 2018 ? "Primo" : "Secondo"} anno</span>
                    <h4 className="text-uppercase mb-2 text-truncate">{student.nome} {student.cognome}</h4>
                    <p className="mb-0"><strong>Codice Fiscale</strong>: {student.cf}</p>
                    <p className="mb-0"><strong>Nascita</strong>: {student.luogoNascita}, {formattaData(student.dataNascita)}</p>
                    <p className="mb-0"><strong>Corso</strong>: {student.idCorso}</p>
                </div>

                <div className="col-5 p-3 bg-white border" style={{borderRadius: 5}}>
                    <Progress type="circle" percent={perc} width={80} className="float-left mr-3" strokeColor={color} />
                    <Statistic title="Presenze totali (ore)" value={tot} suffix="/ 2000" decimalSeparator="," groupSeparator="." />
                </div>
            </div>

            <h3 className="my-3">Presenze studente</h3>
            <PresenzeTable studente={student.idStudente} />
            <h3 className="my-3">Voti studente</h3>
            <VotiStudent studente={student.idStudente} />
        </div>
    }
}