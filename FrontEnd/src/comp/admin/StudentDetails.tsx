import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IStudent } from '../../models/IStudent';
import { routerHistory } from '../..';
import { Icon, Spin, Progress, Statistic } from 'antd';
import PresenzeTable from './PresenzeTable';
import Axios from 'axios';
import { formattaData } from '../../utilities';
import VotiStudent from './VotiStudent';

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
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
            routerHistory.push("/adminpanel")

        /****************************************************/
        /* CARICAMENTO DATI UTENTE (REDIRECT SE NON ESISTE) */
        /* CONTROLLARE ANCHE SE FA PARTE DEL CORSO          */
        /****************************************************/

        Axios.get("http://localhost:3000/reg/api?studente&id=" + id).then((response) => {
            this.setState({
                student: response.data as IStudent
            })
        })
    }

    roundToTwo = (total: number, current: number) => {    
        return Number((Math.round((100 * current / total) * 100) / 100).toFixed(2));
    }

    render(): JSX.Element{
        const { student } = this.state

        let perc = this.roundToTwo(1000, 855.55),
        color = perc >= 80 ? "var(--success)" : "var(--danger)"

        if(!student){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-5 mr-4 p-3 bg-white border position-relative" style={{borderRadius: 5}}>
                    <span className="border-text">{student.anno === 1 ? "Primo" : "Secondo"} anno</span>
                    <h4 className="text-uppercase mb-2 text-truncate">{student.nome} {student.cognome}</h4>
                    <p className="mb-0"><strong>Codice Fiscale</strong>: {student.cf}</p>
                    <p className="mb-0"><strong>Nascita</strong>: {student.luogoNascita}, {formattaData(student.dataNascita)}</p>
                    <p className="mb-0"><strong>Corso</strong>: {student.corso}</p>
                </div>

                <div className="col-5 p-3 bg-white border" style={{borderRadius: 5}}>
                    <Progress type="circle" percent={perc} width={80} className="float-left mr-3" strokeColor={color} />
                    <Statistic title="Presenze totali (ore)" value={9300} suffix="/ 100" decimalSeparator="," groupSeparator="." />
                </div>
            </div>

            <h3 className="my-3">Presenze studente</h3>
            <PresenzeTable studente={student.id} />
            <h3 className="my-3">Voti studente</h3>
            <VotiStudent studente={student.id} />
        </div>
    }
}