import React from "react"
import Axios from "axios"
import { Modal, Button, DatePicker, TimePicker } from "antd"
import { validateTime, formatItalian, siteUrl, formattaData } from "../../utilities"
import locale from "antd/es/date-picker/locale/it_IT"
import moment from "moment"
import { IStudent } from "../../models/IStudent"
import { IMessage } from "../../models/IMessage"

export interface IProps{
    readonly studente: IStudent
    readonly visible: boolean
    readonly annullaAggiunta: () => void
    readonly reloadStage: () => void
}
export interface IState{
    readonly date: string
    readonly oraInizio: string
    readonly oraFine: string
    readonly argomento: string
    readonly loading: boolean
}

export default class AddOreStage extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            date: formatItalian(new Date().toString()),
            oraFine: "",
            oraInizio: "",
            argomento: "",
            loading: false
        }
    }

    changeData = (data: string) => {
        this.setState({
            date: data
        })
    }

    changeInizio = (_: any, oraInizio: string) => {
        console.log(oraInizio)
        this.setState({
            oraInizio
        })
    }

    changeFine = (_: any, oraFine: string) => {
        this.setState({
            oraFine
        })
    }

    changeArgomento = (e: any) => {
        this.setState({
            argomento: e.target.value
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    addStage = (e: any) => {
        e.preventDefault()

        const { studente } = this.props,
        { oraFine, oraInizio, argomento, date } = this.state,
        currentDate = new Date(),
        data = date.split("-")

        if(argomento === "" || date === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(data[2] !== currentDate.getFullYear().toString()){

            Modal.error({
                title: "Errore!",
                content: "Anno non valido. Puoi inserire solo l'anno corrente."
            })

            return
        }

        if(!validateTime(oraFine) || !validateTime(oraInizio)){
            Modal.error({
                title: "Errore!",
                content: "Orari non validi. (ore:minuti)"
            })

            return
        }

        if(oraFine === oraInizio){
            Modal.error({
                title: "Errore!",
                content: "Gli orari devono essere diversi."
            })

            return
        }

        this.toggleLoading()

        Axios.post(siteUrl+"/api/studenti/postorestage/" + studente.idStudente, {
            password: studente.password,
            argomento,
            data: formattaData(date, true),
            oraInizio: new Date(`${data[2]}-${data[1]}-${data[0]} ${oraInizio}`),
            oraFine: new Date(`${data[2]}-${data[1]}-${data[0]} ${oraFine}`),
        }).then(response => {
            let output = response.data as IMessage

            this.toggleLoading()

            if(output.type === "success")
                this.props.reloadStage()
            else{
                Modal.error({
                    title: "Errore!",
                    content: output.message
                })
            }
        })
    }

    render(): JSX.Element{
        const { date, argomento, loading } = this.state,
        { visible, annullaAggiunta } = this.props

        return <Modal title="Registrazione ore di stage" visible={visible} footer={[
            <Button type="primary" onClick={this.addStage} loading={loading}>Aggiungi</Button>,
            <Button type="default" onClick={annullaAggiunta}>Annulla</Button>
        ]} onCancel={annullaAggiunta}>
            <form onSubmit={this.addStage}>
                <div className="form-group">
                    <label className="text-secondary">Data</label>
                    <DatePicker locale={locale} className="w-100 select-date" onChange={(_, d2) => this.changeData(d2)} format="DD-MM-YYYY" defaultValue={moment(date, "DD-MM-YYYY")} disabled={loading} />
                </div>
                
                <div className="form-group">
                    <label className="text-secondary">Mansioni svolte</label>
                    <textarea value={argomento} onChange={this.changeArgomento} className="form-control" disabled={loading}></textarea>
                </div>

                <div className="form-group row mx-0">
                    <div className="col pr-1 pl-0">
                        <label className="text-secondary">Inizio</label>
                        <TimePicker defaultValue={moment(new Date(), 'HH:mm')} format='HH:mm' onChange={this.changeInizio} className="w-100 select-date" minuteStep={10} placeholder="Seleziona un'orario" />
                    </div>

                    <div className="col pr-0 pl-1">
                        <label className="text-secondary">Fine</label>
                        <TimePicker defaultValue={moment(new Date(), 'HH:mm')} format='HH:mm' onChange={this.changeFine} className="w-100 select-date" minuteStep={10} placeholder="Seleziona un'orario" />
                    </div>
                </div>

                <input type="submit" className="d-none" />
            </form>
        </Modal>
    }
}