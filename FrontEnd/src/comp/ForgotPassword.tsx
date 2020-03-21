import React from "react"
import { Modal, Steps, Button } from "antd"
import Axios from "axios"
import { siteUrl } from "../utilities"
import { Cipher } from "../models/Cipher"

export interface IProps{
    readonly show: boolean
    readonly closeModal: () => void
}
export interface IState{
    readonly currentStep: number
    readonly email: string
    readonly code: string
    readonly newPassword: string
    readonly newPasswordConfirm: string
    readonly idCoordinatore: number
    readonly loading: boolean
}

export default class ForgotPassword extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            currentStep: 0,
            email: "",
            code: "",
            newPassword: "",
            newPasswordConfirm: "",
            idCoordinatore: null,
            loading: false
        }
    }

    cancelRecover = () => {
        this.setState({
            currentStep: 0,
            email: "",
            code: "",
            newPassword: "",
            newPasswordConfirm: "",
            idCoordinatore: null,
            loading: false
        })

        this.props.closeModal()
    }

    changeMail = (e: any) => {
        let email = e.target.value.trim()

        this.setState({
            email: email
        })
    }

    changeCode = (e: any) => {
        let code = e.target.value.trim()

        this.setState({
            code: code
        })
    }

    changePassword = (e: any) => {
        let pass = e.target.value

        this.setState({
            newPassword: pass
        })
    }

    changePasswordConfirm = (e: any) => {
        let pass = e.target.value

        this.setState({
            newPasswordConfirm: pass
        })
    }

    increaseStep = () => {
        this.setState({
            currentStep: this.state.currentStep + 1
        })
    }

    switchLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    confirmFirstStep = (e: any) => {
        e.preventDefault()
        
        const { email } = this.state

        if(email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi.",
                maskClosable: true
            })

            return
        }

        this.switchLoading()

        Axios.post(siteUrl+"/api/emailrecuperopassword", {
            email: email
        }).then(response => {
            let data = response.data,
            idCoordinatore = parseInt(data)

            if(!isNaN(idCoordinatore)){
                this.setState({
                    idCoordinatore: idCoordinatore,
                    loading: false
                })

                this.increaseStep()
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Questa e-mail non corrisponde a nessun coordinatore.",
                    maskClosable: true
                })
            }
        })
    }

    confirmSecondStep = (e: any) => {
        e.preventDefault()
        
        const { code, idCoordinatore } = this.state

        if(code === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi.",
                maskClosable: true
            })

            return
        }

        this.switchLoading()

        Axios.post(siteUrl+"/api/confrontacodicerecupero", {
            codice: code,
            idCoordinatore: idCoordinatore
        }).then(response => {
            let msg = response.data

            if(msg.trim() === "success"){
                this.increaseStep()
                this.switchLoading()
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Il codice non corrisponde, o forse la richiesta è scaduta.",
                    maskClosable: true
                })
            }
        })
    }

    savePassword = (e: any) => {
        e.preventDefault()

        const { newPassword, newPasswordConfirm, idCoordinatore, code } = this.state

        if(newPassword === "" || newPasswordConfirm === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi.",
                maskClosable: true
            })

            return
        }

        if(newPassword.length < 8){
            Modal.error({
                title: "Errore!",
                content: "La password deve avere almeno 8 caratteri.",
                maskClosable: true
            })

            return
        }

        if(newPassword !== newPasswordConfirm){
            Modal.error({
                title: "Errore!",
                content: "Le password non corrispondono.",
                maskClosable: true
            })

            return
        }

        this.switchLoading()

        let cipher = new Cipher(),
        password = cipher.encode(newPassword)

        Axios.post(siteUrl+"/api/salvapasswordtutor", {
            idCoordinatore: idCoordinatore,
            password: password,
            codice: code
        }).then(response => {
            let msg = response.data

            if(msg.trim() === "success"){
                Modal.success({
                    title: "Complimenti!",
                    content: "Password modificata con successo.",
                    centered: true,
                    onOk: this.cancelRecover
                })
            }else{
                Modal.error({
                    title: "Errore!",
                    content: "Non è stato possibile completare l'operazione."
                })
            }
        })
    }

    render(): JSX.Element{
        const { show } = this.props
        const { currentStep, email, code, newPassword, newPasswordConfirm, loading } = this.state
        const { Step } = Steps

        const steps = [{
            title: "E-mail",
            content: <form onSubmit={this.confirmFirstStep}>
                <div className="form-group my-3">
                    <label className="text-muted">Inserisci la tua e-mail</label>
                    <input type="email" name="email" value={email} className="form-control" onChange={this.changeMail} disabled={loading} />
                </div>

                <Button htmlType="submit" className="float-right" type="primary" loading={loading}>Prosegui</Button>

                <div className="clearfix"></div>
            </form>
        },
        {
            title: "Codice",
            content: <form onSubmit={this.confirmSecondStep}>
                <div className="form-group my-3">
                    <label className="text-muted">Inserisci il codice ricevuto via e-mail</label>
                    <input type="text" name="code" value={code} className="form-control" onChange={this.changeCode} disabled={loading} />
                </div>

                <Button htmlType="submit" className="float-right" type="primary" loading={loading}>Prosegui</Button>

                <div className="clearfix"></div>
            </form>
        },
        {
            title: "Nuova password",
            content: <form onSubmit={this.savePassword}>
                <div className="form-group my-3">
                    <label className="text-muted">Crea la tua nuova password</label>
                    <input type="password" name="newpassword" value={newPassword} className="form-control" onChange={this.changePassword} disabled={loading} />
                </div>

                <div className="form-group my-3">
                    <label className="text-muted">Conferma la nuova password</label>
                    <input type="password" name="newpassword_conf" value={newPasswordConfirm} className="form-control" onChange={this.changePasswordConfirm} disabled={loading} />
                </div>

                <Button htmlType="submit" className="float-right" type="primary" loading={loading}>Salva la password</Button>

                <div className="clearfix"></div>
            </form>
        }]

        return <Modal visible={show} title="Recupero della password" onCancel={this.cancelRecover} footer={null} maskClosable={false}>
            <Steps size="small" current={currentStep}>
                {
                    steps.map(item => {
                        return <Step key={item.title} title={item.title} />
                    })
                }
            </Steps>

            <div className="steps-content">
                {steps[currentStep].content}
            </div>
        </Modal>
    }
}