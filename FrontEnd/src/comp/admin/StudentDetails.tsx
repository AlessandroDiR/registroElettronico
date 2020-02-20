import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IStudent } from '../../models/IStudent';
import { routerHistory } from '../..';
import { Icon, Spin, Progress, Statistic } from 'antd';
import PresenzeTable from './PresenzeTable';
import Axios from 'axios';
import { formatItalian, siteUrl } from '../../utilities';

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly student: IStudent
    readonly totPresenze: string
    readonly oreTotali: number
}

export default class StudentDetails extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            student: null,
            totPresenze: null,
            oreTotali: null
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push("/adminpanel")

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

        Axios.get(siteUrl+"/api/studenti/gettotaleorelezioni").then((response) => {
            this.setState({
                oreTotali: response.data as number
            })
        })
    }

    roundToTwo = (total: number, current: number) => {    
        return Number((Math.round((100 * current / total) * 100) / 100));
    }

    render(): JSX.Element{
        const { student, totPresenze, oreTotali } = this.state

        if(!student || !totPresenze || !oreTotali){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        let tot = oreTotali.toFixed(2),
        perc = student.frequenza,
        color = perc >= 80 ? "var(--success)" : "var(--danger)"

        return <div className="col-9 px-5 py-4 right-block">
            <div className="row mx-0">
                <div className="col-6 pl-0">
                    <div className="p-3 bg-white border position-relative rounded">
                        <span className="border-text">{student.annoFrequentazione === 1 ? "Primo" : "Secondo"} anno</span>
                        <h4 className="text-uppercase mb-2 text-truncate">{student.nome} {student.cognome}</h4>
                        <p className="mb-0"><strong>Codice Fiscale</strong>: {student.cf}</p>
                        <p className="mb-0"><strong>Data di nascita</strong>: {formatItalian(student.dataNascita)}</p>
                        <p className="mb-0"><strong>E-mail</strong>: {student.email}</p>
                    </div>
                </div>
                <div className="col-6 pr-0">
                    <div className="p-3 bg-white border rounded">
                        <Progress type="circle" percent={perc} width={80} className="float-left mr-3" strokeColor={color} />
                        <Statistic title="Presenze totali (ore)" value={totPresenze} suffix={"/ "+tot} decimalSeparator="," groupSeparator="." />
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>

            <h3 className="mt-3">Presenze dello studente</h3>
            <PresenzeTable studente={student.idStudente} />
            
        </div>
    }
}