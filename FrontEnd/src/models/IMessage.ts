export interface IMessage{
    readonly title: string
    readonly icon: string
    readonly iconColor: string
    readonly message: string
    readonly time: number
}

export const genericError = {
    title: "Ops!",
    icon: "fa-times-circle",
    iconColor: "#de1e30",
    message: "È stato riscontrato un errore durante l'accesso.",
    time: 3000
}