import { ProgressCircle, AreaChart } from "@tremor/react";
import { useEffect, useState } from "react";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { getCookie } from "../../lib/cookieUtils";
import { useRouter } from "next/router";

const Grafici = () => {

    const [cfu, setCfu] = useState(0);
    const [esami, setEsami] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch("/api/exams/findAllExams",{
                headers: {  'Content-Type': 'application/json',
                authorization: `Dhai ${getCookie("tkn")}`}
            });
            let exams = await data.json();

            let newCfu = 0;
            const newExams = [];
            if (Array.isArray(exams.data)) {
                exams.data.map((exam) => {
                    if ((exam.Scelta != undefined && exam.Scelta != null && exam.Scelta != "") &&
                        (exam.Voto != undefined && exam.Voto != null && exam.Voto != "" && exam.Voto % 100 != 0)) {
                        let voto = exam.Voto;
                        let dateExam = parseFloat(exam.Scelta) + 1;
                        if (exam["Data" + dateExam] != undefined && exam["Data" + dateExam] != null & exam["Data" + dateExam] != "") {
                            dateExam = exam["Data" + dateExam];
                            if (dateExam.includes("T")) {
                                dateExam = (dateExam.split("T"))[0];
                                dateExam = dateExam.split("-")
                                dateExam = dateExam[2] + "/" + dateExam[1] + "/" + dateExam[0];
                            }
                        }
                        if(parseFloat(voto) == 31) {
                            voto = 30;
                        }
                        
                        newExams.push({ data: dateExam, voto: voto });
                    }
                    if (exam.Voto != undefined && exam.Voto != null && exam.Voto != "") {
                        newCfu = newCfu + parseFloat(exam.CFU);
                    }
                });
            }
            newExams.sort((a, b) => {
                
                // Prende ogni data e lo trasforma da dd/MM/YYYY in YYYY-MM-dd
                const dateA = new Date(a.data.split('/').reverse().join('-'));
                const dateB = new Date(b.data.split('/').reverse().join('-'));
                
                // Confronta le date e le ordina
                return dateA - dateB;
            });
            
            setCfu(newCfu);
            setEsami(newExams);

        }

        CheckAuthComponent(router);

        setTimeout(() => {
            fetchData();
        }, 0);

        setIsLoading(false);


    }, []);


    if (isLoading) {
        return (
            <div className="centra centraOrizzontale w-full h-full bg-grayContainerExams rounded-3xl " >
                <ProgressCircle
                    className="graficoCerchio"
                    value={(0 / 180) * 100}
                    radius={80}
                    strokeWidth={30}>
                    CARICAMENTO
                </ProgressCircle>
                <AreaChart
                    className="graficoLinee"
                    data={[{ data: "", voto: 0 }]}
                    noDataText="CARICAMENTO GRAFICO"
                    index="data"
                    categories={["voto"]}
                    colors={['gray']}
                    curveType="linear"
                    showXAxis={true}
                    showLegend={false}
                    showGradient={false}
                    startEndOnly={true}
                    autoMinValue={false}
                    maxValue={30}
                    minValue={0}
                    showGridLines={true}
                    showAnimation={true}
                />
            </div>
        )
    }

    return (
        <div className="centra centraOrizzontale w-full h-full bg-grayContainerExams rounded-3xl " >
            <ProgressCircle
                className="graficoCerchio"
                value={(cfu / 180) * 100}
                radius={80}
                strokeWidth={30}>
                {cfu}/180
            </ProgressCircle>
            <AreaChart
                className="graficoLinee"
                data={esami}
                index="data"
                categories={["voto"]}
                noDataText="CARICAMENTO GRAFICO"
                colors={['gray']}
                curveType="linear"
                showXAxis={true}
                showLegend={false}
                showGradient={false}
                startEndOnly={true}
                autoMinValue={false}
                maxValue={30}
                minValue={0}
                
                showGridLines={true}
                showAnimation={true}
            />
        </div>
    );
}

export default Grafici;