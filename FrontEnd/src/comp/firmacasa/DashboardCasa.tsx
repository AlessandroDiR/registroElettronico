import React from "react"
import CodiceSegreto from "./CodiceSegreto"
import FirmaCasa from "./FirmaCasa"

export default class DashboardCasa extends React.Component{

    componentWillUnmount = () => {
        sessionStorage.removeItem("confermaCasa")
    }

    render(): JSX.Element{
        let session = sessionStorage.getItem("confermaCasa")
        
        if(!session)
            return <CodiceSegreto />

        return <FirmaCasa />
    }
}
