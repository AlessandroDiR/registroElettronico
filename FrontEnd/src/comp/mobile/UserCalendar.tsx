import React from "react"
import { Icon, Spin } from "antd"
import { ICalendar } from "../../models/ICalendar"
import { IStudent } from "../../models/IStudent"
import Calendario from "../Calendario"

export interface IProps{
    readonly student: IStudent
}
export interface IState{
    readonly calendar: ICalendar
}

export default class UserCalendar extends React.PureComponent<IProps, IState> {
    constructor(props: IProps){
        super(props)
        
        this.state = {
            calendar: null
        }
    }

    componentDidMount = () => {
        /*************************************/
        /* CARICAMENTO CALENDARIO IN BASE A  */
        /* this.props.student.idCorso        */
        /* this.props.student.annoFrequentazione */
        /*************************************/
    }
    
    render(): JSX.Element{
        const { calendar } = this.state
    
        if(!calendar){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }
        
        return <div className="p-3">
            <h5 className="text-center text-black w-100">Calendario del mese</h5>
            <Calendario calendarId="ckhj7iqj3msae4i4ietm5ip1cg@group.calendar.google.com" />
        </div>
    }
}