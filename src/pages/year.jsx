import { useEffect, useState } from "react";
import HomeLogo from "./homeLogo";
import { Tooltip } from "react-tooltip";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { getCookie } from "../../lib/cookieUtils";
import { useRouter } from "next/router";

function generaCalendario(anno, quadrimestre) {
    const mesi = [];
    const startMonth = (quadrimestre - 1) * 4;
    const endMonth = startMonth + 3;

    for (let i = startMonth; i <= endMonth; i++) {
        const nGiorniMese = new Date(anno, i + 1, 0).getDate();
        const giornoInizioMese = new Date(anno, i, 1).getDay();
        const ggMese = new Array(giornoInizioMese === 0 ? 6 : giornoInizioMese - 1).fill("");

        for (let x = 1; x <= nGiorniMese; x++) {
            ggMese.push(x);
        }

        const ggSett = [];
        for (let x = 0; x < ggMese.length; x += 7) {
            ggSett.push(ggMese.slice(x, x + 7));
        }

        mesi.push(ggSett);
    }

    return mesi;
}

function getMese(n) {
    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    return mesi[n];
}


async function getDateScelte() {
    const allExamsResult = await fetch("/api/exams/findAllExams",{
        headers: {  
        'Content-Type': 'application/json',
        authorization: `Dhai ${getCookie("tkn")}`}
    });
    let allExams = await allExamsResult.json();

    const dateScelte = [];
    const descrizioneEsame = [];

    allExams.data.map(exam => {
        const dataIndex = "Data" + (parseFloat(exam.Scelta) + 1);
        let dataScelta = exam[dataIndex];
        
        if (dataScelta) {
            dataScelta = dataScelta.toString().split("T");
            dateScelte.push(dataScelta[0]);
            if(descrizioneEsame[dataScelta[0]]!== null && descrizioneEsame[dataScelta[0]] !== undefined){
                descrizioneEsame[dataScelta[0]+"_2"]= exam.Materia;
            }else{
                descrizioneEsame[dataScelta[0]]= exam.Materia;
            }
        } else {
            return null;
        }
    })

    return [dateScelte,descrizioneEsame];;

}

function MeseCalendario({ mese, index, quadrimestre, anno, headerGiorni, dateScelte }) {
    return (
        <div className="w-1/4 centra">
            <h2 className="meseCalendario uppercase font-extrabold mb-2">{getMese(index + (quadrimestre - 1) * 4)}</h2>
            <table  className="yearTable">
                <thead>
                    <tr>
                        {headerGiorni.map(headerGiorno => (
                            <th key={headerGiorno} className="ggHeaderCalendario px-2 bg-grayContainerHome">{headerGiorno}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {mese.map((settimana, indexSett) => (
                        <tr key={indexSett}>
                            {settimana.map((giorno, indexGiorno) => {
                                const dataFormatta = anno + "-" + (index + (quadrimestre - 1) * 4).toString().padStart(2, "0") + "-" + giorno.toString().padStart(2, "0");
                                let esamiDelGiorno = "";
                                
                                if(dateScelte[0].includes(dataFormatta)){
                                    esamiDelGiorno = dateScelte[1][dataFormatta];
                                        if(dateScelte[1][dataFormatta+"_2"]!=undefined && dateScelte[1][dataFormatta+"_2"]!=null){
                                            esamiDelGiorno += ","+dateScelte[1][dataFormatta+"_2"]
                                        }
                                }
                                return (
                                    (dateScelte[0].includes(dataFormatta)) ? (
                                        <td className="ggCalendario cursor-help bg-gray-200 rounded-xl "
                                            
                                            data-tooltip-id="situazioneEsami"
                                            data-tooltip-content={`${esamiDelGiorno}`}
                                            cellpadding={50}
                                            index={indexGiorno}>{giorno}</td>
                                    ) : (
                                        <td className="ggCalendario" index={indexGiorno}>{giorno}</td>
                                    )
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Year() {
    const headerGiorni = ["L", "M", "M", "G", "V", "S", "D"];
    const oggi = new Date();

    const [primoQuadrimestre, setPrimoQuadrimestre] = useState([]);
    const [secondoQuadrimestre, setSecondoQuadrimestre] = useState([]);
    const [terzoQuadrimestre, setTerzoQuadrimestre] = useState([]);
    const [dateScelte, setDateScelte] = useState([]);
    const [anno, setAnno] = useState(oggi.getFullYear());

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dates, descriptions] = await getDateScelte();
                setDateScelte([dates, descriptions]);
                setPrimoQuadrimestre(generaCalendario(anno, 1));
                setSecondoQuadrimestre(generaCalendario(anno, 2));
                setTerzoQuadrimestre(generaCalendario(anno, 3));
            } catch (error) {
                console.error("Errore nel recuperare le date scelte:", error);
            }
        };
        CheckAuthComponent(router);
        fetchData();
    }, [anno]);

    return (
        <div className="containerPlanner">
            <div className="titoloYears centraOrizzontale centra">
                <span className="w-1/4 homeLogo"><HomeLogo /></span>
                <h1 className="py-6 text-center text-5xl w-2/4"><b>CALENDARIO</b> <span className="font-light">{anno}</span></h1>
                <span className="w-1/4"></span>
            </div>
            <div className="bodyYears centraOrizzontale">
                <a className="cursor-pointer text-6xl centra" onClick={() => setAnno(anno - 1)}>&lt;</a>
                <div className="calendarsYears h-full">
                    {[primoQuadrimestre, secondoQuadrimestre, terzoQuadrimestre].map((quadrimestre, qIndex) => (
                        <div key={qIndex} className="h-1/3 centraOrizzontale">
                            {quadrimestre.map((mese, index) => (
                                <MeseCalendario
                                    key={index}
                                    mese={mese}
                                    index={index}
                                    quadrimestre={qIndex + 1}
                                    anno={anno}
                                    headerGiorni={headerGiorni}
                                    dateScelte={dateScelte}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <a className="cursor-pointer text-6xl text-right centra" onClick={() => setAnno(anno + 1)}>&gt;</a>
            </div>
            <Tooltip
                id="situazioneEsami"
                render={({ content }) => (
                    <ul className="ulTooltipYear">
                        <span>Esami per questa data:</span>
                        {content ? content.split(",").map((esame, index) => (
                            <li key={index}>{esame}</li>
                        )) : <li>No exams</li>}
                    </ul>
                )}
            />
        </div>
    );
}

export default Year;