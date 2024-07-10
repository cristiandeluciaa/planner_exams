import { useEffect,useState } from "react"
import CheckAuthComponent from "../../../lib/checkAuthComponent"
import { useRouter } from "next/router";
import HomeLogo from "../homeLogo";
import { Image } from "@nextui-org/react";

function Eventi () {

    const router = useRouter();
    const [mese,setMese] = useState();
    const [anno,setAnno] = useState();
    const [settimana,setSettimana] = useState([]);

    const headerMese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    const headerGiorni = ["L", "M", "M", "G", "V", "S", "D"];

    useEffect(()=>{
        
        CheckAuthComponent(router);
        
        const {meseEvento} = router.query;
        
        setMese(headerMese[parseInt(meseEvento.substring(0,2))].toUpperCase());
        setAnno(meseEvento.substring(2));
        setSettimana(generaCalendario(meseEvento.substring(2),parseInt(meseEvento.substring(0,2))+1));

        console.log(generaCalendario(meseEvento.substring(2),parseInt(meseEvento.substring(0,2))+1));

    },[mese,anno])

    return (
        <div className="centraOrizzontale centra pt-2 pb-5 h-full containerPlanner">
            <div className="calendarioEventi centra">
                <table className="tableEventi">
                    <thead>
                        {
                            headerGiorni.map((headerGiorno,indexHeaderGiorno)=>(
                                <th className="tableEventiTh" key={indexHeaderGiorno}>{headerGiorno}</th>
                            ))
                        }
                    </thead>
                    <tbody>
                        {
                            settimana.map((sett, indexSett)=>(
                                <tr key={indexSett}>
                                    {
                                        sett.map((gg,indexGG)=>(
                                            <td className="tableEventiTd" key={indexGG}>
                                                <table>
                                                    <thead>
                                                        <th>{gg}</th>
                                                    </thead>
                                                    <tbody>
                                                        <td><button className="addEvento"><b>+ NUOVO EVENTO</b></button></td>
                                                    </tbody>
                                                </table>
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="meseEvento centra">
                <div className="text-right">
                <span className="meseTitle">{mese}</span><br/><span className="annoTitle">{anno}</span>
                </div>    
            </div>
        </div>
    )
}

function generaCalendario(anno,mese) {
    
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

        while(ggSett[ggSett.length-1].length < 7){
            ggSett[ggSett.length-1].push("");
        }

    return ggSett;
}

export default Eventi;
