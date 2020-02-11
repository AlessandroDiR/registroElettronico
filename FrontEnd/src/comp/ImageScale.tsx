import React from "react"
import { Tooltip } from "antd"

export interface IProps{
    readonly src: string
    readonly width?: number | string
    readonly height?: number | string
    readonly scalable?: boolean
    readonly style?: React.CSSProperties
}
export interface IState{
    readonly scaled: boolean
    readonly coords: number[]
}

export default class ImageScale extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            scaled: false,
            coords: [0, 0]
        }
    }

    scaleImage = () => {
        if(!this.props.scalable) return

        this.setState({
            scaled: !this.state.scaled
        })
        
    }

    render(): JSX.Element{
        const { src, width, height, scalable, style } = this.props
        const { scaled } = this.state
        let firstclass = scalable ? "scalable " : "",
        classname = scaled ? "scaled" : "",
        title = scalable ? "Cliccare per " + (scaled ? "rimpicciolire" : "ingrandire") : null

        return <Tooltip title={title}>
            <img alt="scale" style={style} className={"imagescale "+firstclass+classname} src={src} width={width} height={height} onClick={this.scaleImage} />
        </Tooltip>
    }
}