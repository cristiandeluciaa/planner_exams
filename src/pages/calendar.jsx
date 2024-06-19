import { useEffect, useState } from "react";
import Link from "next/link";
import { calendar } from "@nextui-org/react";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { useRouter } from "next/router";



function getMese() {

    const date = new Date();
    const mese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

    return mese[date.getMonth()];
}

function getOrario() {
    const date = new Date();
    const ora = date.getHours();
    const minuti = date.getMinutes();

    const minutiFormattati = (minuti < 10 ? '0' : '') + minuti;

    return ora + " : " + minutiFormattati;
}

function generaCalendario(nGiorniMese, giornoInizioMese) {

    const ggMese = [];

    if(giornoInizioMese==0){
        for (let x = 0; x < 6; x++) {
            ggMese.push("");
        }
    }else{
    for (let x = 1; x < giornoInizioMese; x++) {
        ggMese.push("");
    }
}

    for (let x = 1; x <= nGiorniMese; x++) {
        ggMese.push(x);
    }

    const ggSett = [];

    for (let x = 0; x <= nGiorniMese; x += 7) {

        ggSett.push(ggMese.slice(x, x + 7));

    }


    return ggSett;
}

function Calendar() {


    const headerGiorni = ["L", "M", "M", "G", "V", "S", "D"];
    const [GiorniMesi, setGiorniMesi] = useState([]);
    const today = new Date();

    const router = useRouter();


    useEffect(() => { 
        
        CheckAuthComponent(router);

        const nGiorniMese = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const giornoInizioMese = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
        setGiorniMesi(generaCalendario(nGiorniMese, giornoInizioMese));

    }, []);

    return (
        <div className="containerCalendario bg-greyExamsComponent rounded-3xl centra centraOrizzontale h-full cursor-pointer">
            <Link href="/year" className="centraOrizzontale" >
            <div className="containerOrario  centra float-left">
                {getOrario()}
            </div>
            <div className="calendarioHome centra  border-l-grayContainerExams border-l-4 float-left">
                <h2 className="meseCalendario uppercase ">{getMese()}</h2>
                <table>
                    <thead>
                    <tr>
                        {
                            headerGiorni.map((headerGiorno, indexHeader) => (
                                <th key={indexHeader} className="ggHeaderCalendario  px-5 py-1">{headerGiorno}</th>
                             ))
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            GiorniMesi.map((settimana, indexSett) => (
                                <tr key={indexSett}>
                                    {
                                        settimana.map((giorno, indexGiorno) => (
                                            
                                                (giorno === today.getDate() )?(
                                                    <td key={indexGiorno} className="ggCalendarioHome text-neutral-500 py-1 bg-neutral-300  rounded-xl" index={indexGiorno}>{giorno}</td>
                                                ):(
                                                    <td key={indexGiorno} className="ggCalendarioHome text-neutral-500 py-1" index={indexGiorno}>{giorno}</td>
                                                )
                                            
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
            </Link>
        </div>
    )
}

export default Calendar;