import React from "react"
import { mountLogin, unmountLogin, siteUrl, adminRoute, superAdminRoute } from "../utilities"
import { routerHistory } from ".."

export default class Docs extends React.Component{
    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    scrollToIndex = (id: string) => {
        let block = document.getElementById(id)
        
        block.scrollIntoView()
        block.classList.add("highlight")

        setTimeout(() => {
            block.classList.remove("highlight")
        }, 1000)
    }

    render(): JSX.Element{
        return <div className="col-11 col-lg-8 mx-auto" id="loginBlock">
            <div className="w-100 bg-white p-4 rounded shadow text-justify my-4">
                <span className="link-blue float-right" onClick={() => routerHistory.push("/")}>
                    <i className="far fa-arrow-left fa-fw fa-lg"></i> Torna al registro
                </span>

                <div className="clearfix"></div>

                <h4 className="mb-1">Come funziona il sito?</h4>
                <p>Tramite questa semplice pagina andremo ad elencare le varie pagine del sito, nonché la modalità di accesso ad esse, suddividendo per i ruoli principali.</p>

                <div className="ml-4">
                    <h6>Indice:</h6>
                    <ul>
                        <li><span className="link-primary u-hover" onClick={() => this.scrollToIndex("stuDoc")}>Studenti e docenti</span></li>
                        <li><span className="link-primary u-hover" onClick={() => this.scrollToIndex("tutor")}>Coordinatori</span></li>
                        <li><span className="link-primary u-hover" onClick={() => this.scrollToIndex("admin")}>Amministratori</span></li>
                    </ul>
                </div>

                <div className="pl-4 p-2 rounded overflow-hidden" id="stuDoc">
                    <h6>Studenti e Docenti</h6>
                    <p className="mb-2">Gli studenti e i docenti avranno la possibilità di firmare la loro entrata/uscita da una lezione tramite <a href={siteUrl+"/#/"} target="_blank" rel="noopener noreferrer">questo</a> URL.</p>
                    <p>Una volta scelti il corso e la classe, l'accesso alla firma è possibile <strong>solamente</strong> tramite un codice segreto, fornito dal coordinatore del corso o, eventualmente, dal docente incaricato della lezione.</p>
                </div>

                <div className="pl-4 p-2 rounded overflow-hidden" id="tutor">
                    <h6>Coordinatori</h6>
                    <p className="mb-2">I coordinatori avranno la possibilità di gestire il corso a cui sono stati assegnati. Tramite <a href={siteUrl+"/#"+adminRoute} target="_blank" rel="noopener noreferrer">questo</a> URL si può accedere al gestionale, inserendo Username e Password ricevuti via e-mail dall'amministratore.</p>
                    <p className="mb-2">
                        Grazie al gestionale, è possibile gestire le seguenti attività:
                    </p>
                        <ul>
                            <li>Studenti:</li>
                            <ul>
                                <li>Creazione e modifica di studenti, specificando i dati anagrafici e la classe di appartenenza.</li>
                                <li>Possibilità di importare una classe tramite CSV, per velocizzare il processo.</li>
                                <li>Possibilità di spostare gli studenti dal primo al secondo anno.</li>
                                <li>Visualizzazione del dettaglio di uno studente, con la lista delle lezioni frequentate da quest'ultimo.</li>
                                <li>Possibilità di modificare l'entrata o l'uscita di uno studente (nel caso in cui sia stato commesso un errore) tramite appositi bottoni nella lista delle lezioni frequentate.</li>
                                <li>Possibilità di ritirare uno studente tramite apposito bottone nella lista degli studenti.</li>
                                <li>Possibilità di archiviare uno studente (nel caso in cui quest'ultimo sia stato promosso) tramite apposito bottone nella lista degli studenti.</li>
                            </ul>
                            <li>Docenti:</li>
                            <ul>
                                <li>Creazione e modifica di docenti, specificando i dati anagrafici, le materie insegnate e i corsi di appartenenza.</li>
                                <li>Visualizzazione del dettaglio di un docente, con la lista delle lezioni tenute da quest'ultimo.</li>
                                <li>Possibilità di modificare l'entrata o l'uscita di un docente (nel caso in cui sia stato commesso un errore) tramite appositi bottoni nella lista delle lezioni tenute.</li>
                                <li>Possibilità di ritirare un docente dal corso tramite apposito bottone nella lista dei docenti, con possibilità di annullare l'azione di ritiro in caso di reintegro nel corso.</li>
                            </ul>
                            <li>Materie:</li>
                            <ul>
                                <li>Creazione e modifica di materie del corso.</li>
                            </ul>
                            <li>Calendario:</li>
                            <ul>
                                <li>
                                    <p>Possibilità di configurare il calendario delle classi del corso, caricando così le lezioni nel database del registro.</p>

                                    <p>Gli eventi del calendario dovranno <strong>obbligatoriamente</strong> essere scritti nel seguente modo: <strong>LUOGO: DOCENTE - MATERIA</strong> (esempio: LAB 1 PASCAL: Matteo Mascellani - PHP).</p>
                                    
                                    <p className="mb-0"><strong>ATTENZIONE</strong>: prima di configurare il calendario è necessario creare tutte le materie e i docenti citati nel calendario stesso. Ovviamente, è possibile salvare nuovamente il calendario per aggiornare le lezioni nel caso in cui si aggiungano docenti o materie durante l'anno.</p>
                                </li>
                            </ul>
                            <li>Firma da remoto:</li>
                            <ul>
                                <li>
                                    <p>Possibilità di abilitare la firma da casa qualora sia necessario.</p>

                                    <p>Tramite <a href={siteUrl+"/#"+adminRoute+"/codicefirma"} target="_blank" rel="noopener noreferrer">questo</a> URL è possibile creare un codice segreto per identificare la classe scelta. Il codice andrà condiviso con gli studenti, e <u>dovrà essere cambiato una volta terminata la lezione</u>.</p>
                                    
                                    <p>Da <a href={siteUrl+"/#/firmacasa"} target="_blank" rel="noopener noreferrer">questo</a> URL gli studenti saranno in grado di inserire il codice creato e, scegliendo il loro nome e cognome, potranno firmare per la lezione programmata.</p>

                                    <p>Il procedimento rimane identico anche per i docenti, con la differenza che quest'ultimi potranno firmare tramite un semplice bottone.</p>
                                </li>
                            </ul>
                        </ul>
                </div>
                <div className="pl-4 p-2 rounded overflow-hidden" id="admin">
                    <h6>Amministratori</h6>
                    <p className="mb-2">Gli amministratori avranno la possibilità di gestire FITSTIC. Tramite <a href={siteUrl+"/#"+superAdminRoute} target="_blank" rel="noopener noreferrer">questo</a> URL si può accedere al gestionale, inserendo Username e Password dell'amministratore.</p>
                    <p className="mb-2">
                        Grazie al gestionale, è possibile gestire le seguenti attività:
                    </p>
                        <ul>
                            <li>Corsi:</li>
                            <ul>
                                <li>Creazione e modifica di corsi (es: Alan Turing, McLuhan, Hopper, ecc.), con possibilità di inserire nome, luogo e logo del corso.</li>
                                <li>Creazione e modifica di coordinatori, che possono essere assegnati ad un determinato corso per gestirlo di conseguenza.</li>
                            </ul>
                        </ul>
                </div>
            </div>
        </div>
    }
}