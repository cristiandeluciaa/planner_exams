import { useEffect, useState } from "react";
import CheckAuthComponent from "../../../lib/checkAuthComponent";
import { parseDateTime, parseZonedDateTime, now } from "@internationalized/date";
import { useRouter } from "next/router";
import { Image,Link, Textarea } from "@nextui-org/react";
import moment from "moment";
import axios from "axios";
import { I18nProvider } from 'react-aria';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Input, DatePicker, Select, SelectItem } from "@nextui-org/react";
import { getCookie } from "../../../lib/cookieUtils";
import { Tooltip } from "react-tooltip";
import { renderToStaticMarkup } from 'react-dom/server';
import HomeLogo from "../homeLogo";

function Eventi() {
    const router = useRouter();
    const [mese, setMese] = useState();
    const [anno, setAnno] = useState();
    const [categoria, setCategoria] = useState();
    const [settimana, setSettimana] = useState([]);

    const [op, setOp] = useState("AGGIUNGI");
    const [id_evento, setId_evento] = useState();
    const [evento, setEvento] = useState();
    const [descrizione, setDescrizione] = useState();
    const [dataEvento, setDataEvento] = useState();
    const [allEvents, setAllEvents] = useState([]);
    const [eventoMese, setEventoMese] = useState();
    const [dateEsami, setDateEsami] = useState([]);

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const coloriArray = [{ key: "ROSSO", value: "red" }, { key: "BLU", value: "blue" }, { key: "VERDE", value: "green" }];
    const headerMese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    const headerGiorni = ["L", "M", "M", "G", "V", "S", "D"];

    const findAllEvents = async () => {
        const events = await axios.post("/api/eventi/findAllEvento", {}, { headers: { Authorization: `Dhai ${getCookie("tkn")}` } });
        return events.data.data;
    }

    useEffect(() => {
        CheckAuthComponent(router);

        const { meseEvento } = router.query;

        if (meseEvento) {
            setEventoMese(parseInt(meseEvento.substring(0, 2)));
            setMese(headerMese[parseInt(meseEvento.substring(0, 2))].toUpperCase());
            setAnno(meseEvento.substring(2));
            setSettimana(generaCalendario(meseEvento.substring(2), parseInt(meseEvento.substring(0, 2)) + 1));
        }

        const fetchEvents = async () => {
            const events = await findAllEvents();
            const [data, descrizione] = await getDateScelte();
            setDateEsami([data, descrizione]);
            setAllEvents(events);
        };

        fetchEvents();
    }, [router.query]);

    const openModal = (gg) => {
        const oraAttuale = new Date();
        setDataEvento(parseDateTime(anno + "-" + (eventoMese + 1).toString().padStart(2, '0') + "-" + gg.toString().padStart(2, '0') + "T" + (oraAttuale.getHours()).toString().padStart(2, '0') + ":00"));
        setOp("AGGIUNGI");
        setCategoria("blue");
        setEvento("");
        setDescrizione("");
        onOpen();
    }

    const openModalEdit = (id, data, evento, descrizione, categoria) => {
        setOp("MODIFICA");
        setId_evento(id);
        setDataEvento(data);
        setEvento(evento);
        setDescrizione(descrizione)
        setCategoria(categoria);
        onOpen();
    }

    const submitEvento = async (opDelete = false) => {
        
        if (op === "MODIFICA") {
            if (opDelete) {
                const eventoDeleted = await axios.post("/api/eventi/deleteEvento", {
                    id_evento: id_evento
                }, {
                    headers: {
                        Authorization: `Dhai ${getCookie("tkn")}`
                    }
                });

                if (eventoDeleted.data.success) {
                    alert("Evento eliminato!");
                    setAllEvents(allEvents.filter(event => event.Id_evento !== id_evento));
                }
            } else {
                const eventoModified = await axios.post("/api/eventi/editEvento", {
                    id_evento: id_evento,
                    evento: evento,
                    descrizione: descrizione,
                    dataEvento: dataEvento.toString() + "Z",
                    categoria: categoria
                }, {
                    headers: {
                        Authorization: `Dhai ${getCookie("tkn")}`
                    }
                });

                if (eventoModified.data.success) {
                    alert("Evento modificato!");
                    setAllEvents(allEvents.map(event => event.Id_evento === id_evento ? { ...event, Evento: evento, Descrizione: descrizione, Data: dataEvento.toString() + "Z", Categoria: categoria.toString() } : event));
                }
            }
        } else {
            const eventoCreated = await axios.post("/api/eventi/createEvento", {
                evento: evento,
                descrizione: descrizione,
                dataEvento: dataEvento.toString() + "Z",
                categoria: categoria
            }, {
                headers: {
                    Authorization: `Dhai ${getCookie("tkn")}`
                }
            });
            
            const createdEvents = [
                ...allEvents,
                {
                    Id_evento: eventoCreated.data.data.Id_evento,
                    Evento: evento,
                    Descrizione: descrizione,
                    Data: dataEvento.toString() + "Z",
                    Categoria: categoria.toString()
                }
            ];

            createdEvents.sort((a, b) => new Date(a.Data) - new Date(b.Data));
            setAllEvents(createdEvents);
        }
        onClose();
    }


    const renderEvento = (evento, indexEvento, showDescription = false) => (
        <li key={indexEvento}  >
            <button
                title={evento.Evento}
                className={`bg-${evento.Categoria}-100 text-${evento.Categoria}-700 event ${showDescription && "eventTooltip"} `}
                onClick={() => openModalEdit(
                    evento.Id_evento,
                    parseDateTime(evento.Data.split("Z")[0]),
                    evento.Evento,
                    evento.Descrizione,
                    evento.Categoria
                )}
            >
                <b className="titoloEvento uppercase">{evento.Data.substring(11, 16) + " | " + evento.Evento}</b>
                {showDescription && <p className="dettaglioEvento">{evento.Descrizione}</p>}
            </button>
        </li>
    );


    return (
        <>
            <div className="centraOrizzontale centra h-full containerPlanner">
                <div className="calendarioEventi">
                    <table className="tableEventi">
                        <thead>
                            <tr>
                                {headerGiorni.map((headerGiorno, indexHeaderGiorno) => (
                                    <th className="tableEventiTh" key={indexHeaderGiorno}>{headerGiorno}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {settimana.map((sett, indexSett) => (
                                <tr className="tableEventiTr" key={indexSett}>
                                    {sett.map((gg, indexGG) => (
                                        <td className={`tableEventiTd ${(gg === "") ? "bg-grayContainerExams" : ""} ${ (settimana.length > 5) ? "tableEventiUlHeight" : "" }`} key={indexGG}>
                                            <span className="tableEventiTdSpan"><span className="ggStyle">{gg}</span>
                                                {gg !== "" && (
                                                    <button className="addEvento" onClick={() => { openModal(gg) }}>
                                                        <b>+ EVENTO</b>
                                                    </button>
                                                )}
                                            </span>
                                            <ul className="tableEventiUl" >
                                                {(() => {    
                                                    //  questa modalità si chiama funzione autoinvocata, ovvero uyna funzione defiunita e poi invocata immediatamente ,che permette di gestire emeglio il codice all'intertno (() => { ... })()
                                                    let nEvMax = (settimana.length > 5) ? 2 : 3; // se le righe delle settimane nella tabella sono più di 5 nella cella faccio andare un evento in meno in preview per agevolare la visibilità
                                                    let nEv = 0;
                                                    let eventiTotali = [];
                                                    let eventiEsami = [];

                                                    let dataGG = anno + "-" + (eventoMese + 1).toString().padStart(2, '0') + "-" + gg.toString().padStart(2, '0');

                                                    if (dateEsami[0] !== undefined && dateEsami[0] !== null) {
                                                        if (dateEsami[0].includes(dataGG)) {
                                                            nEv++;
                                                            
                                                            eventiEsami.push(<li>
                                                                <div className={`bg-purple-100 text-purple-700 event } `} title={dateEsami[1][dataGG]} >
                                                                    <b className="titoloEvento uppercase">{dateEsami[1][dataGG]}</b>
                                                                </div>
                                                            </li>);
                                                        }
                                                    }

                                                    const listaEventi = allEvents.map((evento, indexEvento) => {  /* messi in lista eventi i componentni per avere la possibilità di aggionraree lo state nEventi */

                                                        let dateDB = new Date(evento.Data);
                                                        dateDB = dateDB.getFullYear() + "-" + (dateDB.getMonth() + 1).toString().padStart(2, '0') + "-" + dateDB.getDate().toString().padStart(2, '0');

                                                        if (dateDB == dataGG) {

                                                            nEv++;

                                                            eventiTotali.push(renderEvento(evento, indexEvento, true));

                                                            if (nEv <= nEvMax) {
                                                                return renderEvento(evento, indexEvento, false);
                                                            }

                                                        }
                                                        return null;
                                                    })

                                                    if (nEv > nEvMax) {

                                                        return [...eventiEsami, ...listaEventi,
                                                        <><li
                                                            data-tooltip-id="eventiGiorno"
                                                        ><button className="eventiSurplus"><b>+ {nEv - nEvMax}</b></button></li>
                                                            <Tooltip
                                                                id="eventiGiorno"
                                                                className="tooltipEvSurplus"
                                                                opacity={1}
                                                                clickable
                                                            >{eventiTotali}</Tooltip></>];
                                                    } else {
                                                        return [...eventiEsami, listaEventi];
                                                    }

                                                })()}

                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="meseEvento centra ">
                    <div className="homeLogo w-full text-right"><Link href="\planner"><Image src="..\home.png" alt="Logo" width={35} height={35} /></Link></div>
                    <div className="meseAnnoEventi text-right">
                        <div><span className="meseTitle clear-right">{mese}</span><br /><span className="annoTitle clear-right">{anno}</span></div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {op.toUpperCase()} EVENTO
                            </ModalHeader>
                            <ModalBody>
                                <label>EVENTO</label>
                                <Input type="text" className="inputEvento border-none " variant="default" aria-label="Evento" value={evento} onChange={(e) => { setEvento(e.target.value); }} />
                                <label>DETTAGLIO</label>
                                <Textarea type="text"  className="inputEvento border-none ring-transparent" variant="default" aria-label="Dettaglio evento" value={descrizione} onChange={(e) => { setDescrizione(e.target.value); }} />
                                <label>DATA E ORA</label>
                                <I18nProvider locale="it-IT"> {/* Serve a imposare la dara e l'ora in italiano (formato : dd/MM/YYYY HH:mm) dall'attuale formato internazionale MM/dd/YYYY HH:mm PM/AM */}
                                    <DatePicker
                                        value={dataEvento}
                                        onChange={(date) => {
                                            setDataEvento(parseDateTime(date.year + "-" + (date.month).toString().padStart(2, '0') + "-" + date.day.toString().padStart(2, '0') + "T" + date.hour.toString().padStart(2, '0') + ":" + date.minute.toString().padStart(2, '0')));
                                        }}
                                        hideTimeZone
                                        showMonthAndYearPickers
                                        aria-label="Data"
                                        defaultValue={now("Europe/Rome")}
                                    />
                                </I18nProvider>
                                <label>CATEGORIA</label>
                                <Select
                                    defaultSelectedKeys={[categoria]}
                                    placeholder="Seleziona una categoria"
                                    items={coloriArray}
                                    aria-label="Categoria"
                                    onChange={e => { setCategoria(e.target.value); }}
                                >
                                    {(colori) => <SelectItem className="p-2 float-left" key={colori.value} startContent={<div className={`float-left bg-${colori.value}-100 w-4 h-4 mr-1`}></div>}>
                                        {colori.key}
                                    </SelectItem>}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                {op === "MODIFICA" && (
                                    <Button onPress={() => { submitEvento(true); }} >ELIMINA</Button>
                                )}
                                <Button onPress={() => {submitEvento(false); }}>{op.toUpperCase()}</Button>
                                <Button onPress={onClose}>CHIUDI</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

async function getDateScelte() {
    // Ricavo tutti gli esami dall'api e valorizzo allExams 
    const allExamsResult = await fetch("/api/exams/findAllExams", {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Dhai ${getCookie("tkn")}`
        }
    });
    let allExams = await allExamsResult.json();

    const dateScelte = [];
    const descrizioneEsame = [];

    // Ciclo ogni esame trovato
    allExams.data.map(exam => {

        // exam.Scelta sarebbe la scelta della data tra le varie proposte di date, es. se scelto 2 , la data quella in Data2
        const dataIndex = "Data" + (parseFloat(exam.Scelta) + 1);

        // Una volta ricavato quale campo Data sia tra i Data1, Data2, Data3 e Data4, si va a ricavare effetivamente la il valore della data sul db
        let dataScelta = exam[dataIndex];

        // Si verifica se esiste una data selezionata per fare l'esame 
        if (dataScelta) {

            // Si prende dal db la data in formato YYYY-MM-dd dal formato del db ovvero YYYY-MM-ddTHH:mm:ss
            dataScelta = dataScelta.toString().split("T");

            // Il valore della data scelta è in dataScelta[0]
            dateScelte.push(dataScelta[0]);

            // Inserisco la descrizione dell'esame alla posizione dataScelta[0][{dataScelta}}]
            descrizioneEsame[dataScelta[0]]= exam.Materia;

        } else {
            return null;
        }
    })

    return [dateScelte, descrizioneEsame];
}

function generaCalendario(anno, mese) {
    const nGiorniMese = new Date(anno, mese, 0).getDate();
    const giornoInizioMese = new Date(anno, mese, 1).getDay();
    const ggMese = new Array(giornoInizioMese === 0 ? 6 : giornoInizioMese - 1).fill("");

    for (let x = 1; x <= nGiorniMese; x++) {
        ggMese.push(x);
    }

    const ggSett = [];
    for (let x = 0; x < ggMese.length; x += 7) {
        ggSett.push(ggMese.slice(x, x + 7));
    }

    while (ggSett[ggSett.length - 1].length < 7) {
        ggSett[ggSett.length - 1].push("");
    }

    return ggSett;
}

const format = "YYYY-MM-DDTHH:mm";

export default Eventi;