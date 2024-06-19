import { DatePicker, Button } from "@nextui-org/react";
import HomeLogo from "./homeLogo";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import axios from "axios";
import moment from "moment";
import {parseDate} from "@internationalized/date";
import { getCookie } from "../../lib/cookieUtils";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { useRouter } from "next/router";

function Exams() {

    const [rows, setRows] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const anno = new Date().getFullYear();
    const router = useRouter();

    useEffect(() => {
        CheckAuthComponent(router);
        selectAllExams();
    }, []);

    const selectAllExams = async () => {

        try {
            // Carica gli esami già presenti 
            const examsResponse = await fetch("/api/exams/findAllExams",{
                headers: { 
                    'Content-Type': 'application/json',
                    authorization: `Dhai ${getCookie("tkn")}`}
            });
            const examsData = await examsResponse.json();
            
            const newRows = [...examsData.data];
            
            // Riempie con righe vuote se gli esami già presneti sono minori di 8
            for (let i = newRows.length; i < 8; i++) {
                newRows.push({Id_esame :"", Materia: "", CFU: "", Voto: "", Data1: "", Data2: "", Data3: "", Data4: "", Data5: "", Scelta: "", op: "AGGIUNGI"});
            } 

            setRows(newRows);
            setisLoading(false);

        } catch (errore) {
            console.log("errore ", errore);
        }

    }

    const addRows = () => {
        const updateRows = [...rows, {  Materia: "", CFU: "", Voto: "", Data1: "", Data2: "", Data3: "", Data4: "", Data5: "", Scelta: "", op: "AGGIUNGI" }];
        setRows(updateRows);
    }
    
    if (isLoading) {
        const i = [];
        return <>
            <div className="centraOrizzontale centra pt-2 pb-5">
                <span className="w-1/4 homeLogo"><HomeLogo /></span><h1 className="py-6 text-center text-5xl w-2/4"> <b>EXAMS</b><br></br>{
                    (new Date().getMonth() > 7) ? (<span className="font-light">{anno}/{anno + 1}</span>) : (<span className="font-light">{anno - 1}/{anno}</span>)
                }</h1><span className="addIcon w-1/4"><Image width={35} height={35} alt="Add row" src="more.png" className="float-right  rounded-none cursor-pointer" onClick={addRows} /> </span>
            </div>
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
            <RowElement id="" materiaPar="" cfuPar="" votoPar="" data1Par="" data2Par="" data3Par="" data4Par="" data5Par="" scelta="" op="AGGIUNGI" />
        </>;
        
    }

    return (
        <>
            <div className="centraOrizzontale centra pt-2 pb-5">
                <span className="w-1/4 homeLogo"><HomeLogo /></span><h1 className="py-6 text-center text-5xl w-2/4"> <b>EXAMS</b><br></br>{
                    (new Date().getMonth() > 7) ? (<span className="font-light">{anno}/{anno + 1}</span>) : (<span className="font-light">{anno - 1}/{anno}</span>)
                }</h1><span className="addIcon w-1/4"><Image width={35} height={35} src="more.png" alt="Add row" className="float-right  rounded-none cursor-pointer" onClick={addRows} /> </span>
            </div>

            { 
                rows.map((row, index) => (
                    <RowElement key={row.Id_esame} id={row.Id_esame} materiaPar={row.Materia} cfuPar={row.CFU} votoPar={row.Voto} data1Par={row.Data1} data2Par={row.Data2} data3Par={row.Data3} data4Par={row.Data4} data5Par={row.Data5} scelta={row.Scelta} op={row.op} />
                ))
                }
                </>
    )
 
}


const RowElement = ({id, materiaPar, cfuPar, votoPar, data1Par, data2Par, data3Par, data4Par, data5Par, scelta, op}) => {
 
    const id_esame = id;
    const [operazione, setOperazione] = useState(op);
    const [materia, setMateria] = useState(materiaPar);
    const [cfu, setCfu] = useState(cfuPar);
    const [voto, setVoto] = useState(votoPar);
    const [stileCella, setStileCella] = useState(["white","white","white","white"]);
    const [selectedDateCol0, setSelectedDateCol0] = useState();
    const [selectedDateCol1, setSelectedDateCol1] = useState();
    const [selectedDateCol2, setSelectedDateCol2] = useState();
    const [selectedDateCol3, setSelectedDateCol3] = useState();
    const [selectedDateCol4, setSelectedDateCol4] = useState();

    useEffect(() => {

        if (data1Par) {
            let date1  = data1Par.split('T')[0];
            date1 = parseDate(date1);
            setSelectedDateCol0(date1);
        }
    
        if (data2Par) {
            let date2  = data2Par.split('T')[0];
            date2 = parseDate(date2);
            setSelectedDateCol1(date2);
        }

        if (data3Par) {
            let date3  = data3Par.split('T')[0];
            date3 = parseDate(date3);
            setSelectedDateCol2(date3);
        }

        if (data4Par) {
            let date4  = data4Par.split('T')[0];
            date4 = parseDate(date4);
            setSelectedDateCol3(date4);
        }

        if (data5Par) {
            let date5  = data5Par.split('T')[0];
            date5 = parseDate(date5);
            setSelectedDateCol4(date5);
        }

        if (operazione == "AGGIUNGI") {
            setOperazione("AGGIUNGI");
        } else {
            setOperazione("MODIFICA");
        }

        if(scelta){
            let newStileCella = [...stileCella];
            const indexCella = scelta;
            newStileCella[indexCella] = "#BDBDBB";
            setStileCella(newStileCella);
        }

    }, []);

    const handleSelectedDateCol0 = (date) => {
        setSelectedDateCol0(date);
    }

    const handleSelectedDateCol1 = (date) => {
        setSelectedDateCol1(date);
    }

    const handleSelectedDateCol2 = (date) => {
        setSelectedDateCol2(date);
    }

    const handleSelectedDateCol3 = (date) => {
        setSelectedDateCol3(date);
    }

    const handleSelectedDateCol4 = (date) => {
        setSelectedDateCol4(date);
    } 

    const handleMateria = (e) => {
        setMateria(e.target.value);
    }

    const handleVoto = (e) => {
        setVoto(e.target.value);
    }

    const handleCfu = (e) => {
        const cfuSplitted = (e.target.value).split(" ");
        setCfu(cfuSplitted[0]);

        setTimeout(()=>{
            e.target.setSelectionRange(cfuSplitted[0].length,cfuSplitted[0].length)
        },0)

    }


    const saveData = async () => {
        if (operazione == "AGGIUNGI") {
            const createExam = await axios.post("/api/exams/createExam", {
                Materia: materia,
                CFU: cfu,
                Voto: voto,
                Data1: selectedDateCol0,
                Data2: selectedDateCol1,
                Data3: selectedDateCol2,
                Data4: selectedDateCol3,
                Data5: selectedDateCol4,
                Id_utente: 1
            }, {headers: { authorization: `Dhai ${getCookie("tkn")}`}});
            
            alert("Esame creato!");
        
        } else {
            const editedExam = await axios.post("/api/exams/editExam", {
                Id_esame: id,
                Materia: materia,
                CFU: cfu,
                Voto: voto,
                Data1: selectedDateCol0,
                Data2: selectedDateCol1,
                Data3: selectedDateCol2,
                Data4: selectedDateCol3,
                Data5: selectedDateCol4,
                Id_utente: 1
            }, {headers: { authorization: `Dhai ${getCookie("tkn")}`}});
            alert("Esame modificato!");
        }
    }

    const riposizionaCursore = (e) => {
        e.target.setSelectionRange((e.target.value).length-4,(e.target.value).length-4);
    }

    return (
        <div className="centraOrizzontale centra caret-neutral-300 pb-12" >
            <input type="text" className="sezioneEsameBig inputExam" value={materia} onChange={handleMateria} />
            <input type="text" className={`${(cfu)?"bg-grayContainerExams": ""} sezioneEsameSmall inputExam`} value={(cfu!="")?cfu+" CFU" : cfu} onChange={handleCfu} onFocus={riposizionaCursore} onClick={riposizionaCursore} />
            <input type="text" className="sezioneEsameSmall inputExam" value={voto} onChange={handleVoto} />
            <DatePicker
                className="sezioneEsame selectDateExam"
                selectorButtonProps={{
                    style: {
                        backgroundColor: `${(stileCella[0])}`,
                        color: "black",
                        width: "100%",
                        borderRadius: "none",
                        padding: "0px"
                    }
                }}
                value={selectedDateCol0}
                onChange={handleSelectedDateCol0}
                CalendarBottomContent={<ButtonSceltaEsame Id_esame={id_esame} nData={"0"} />}
                visibleMonths={3}
                selectorIcon={<span className="color-black ">{formattaData(selectedDateCol0,true).toUpperCase()}</span>}
            />
            <DatePicker
                className="sezioneEsame selectDateExam"
                selectorButtonProps={{
                    style: {
                        backgroundColor: `${(stileCella[1])}`,
                        color: "black",
                        width: "100%",
                        borderRadius: "none",
                        padding: "0px"
                    }
                }}
                value={selectedDateCol1}
                onChange={handleSelectedDateCol1}
                CalendarBottomContent={<ButtonSceltaEsame Id_esame={id_esame} nData={"1"} />}
                visibleMonths={3}
                selectorIcon={<span className="color-black ">{formattaData(selectedDateCol1,true).toUpperCase()}</span>}
            />
            <DatePicker
                className="sezioneEsame selectDateExam"
                selectorButtonProps={{
                    style: {
                        backgroundColor: `${(stileCella[2])}`,
                        color: "black",
                        width: "100%",
                        borderRadius: "none",
                        padding: "0px"
                    }
                }}
                value={selectedDateCol2}
                onChange={handleSelectedDateCol2}
                CalendarBottomContent={<ButtonSceltaEsame Id_esame={id_esame} nData={"2"} />}
                visibleMonths={3}
                selectorIcon={<span className="color-black ">{formattaData(selectedDateCol2,true).toUpperCase()}</span>}
            />
            <DatePicker
                className="sezioneEsame selectDateExam "
                selectorButtonProps={{
                    style: {
                        backgroundColor: `${(stileCella[3])}`,
                        color: "black",
                        width: "100%",
                        borderRadius: "none",
                        padding: "0px"
                    }
                }}
                value={selectedDateCol3}
                onChange={handleSelectedDateCol3}
                CalendarBottomContent={<ButtonSceltaEsame Id_esame={id_esame} nData={"3"} />}
                visibleMonths={3}
                selectorIcon={<span className="color-black ">{formattaData(selectedDateCol3,true).toUpperCase()}</span>}
            />
            <Button color="default" variant="flat" className="buttonExams rounded-md font-bold hover:bg-neutral-300" onClick={saveData}  aria-label={operazione} >{operazione}</Button>
        </div>
    )
}

const ButtonSceltaEsame = ({nData,Id_esame}) => {
    
      const handleClick = async () => {
        
        const updateScelta = await axios.post("/api/exams/editExam", { 
            Scelta : nData,
            Id_esame : Id_esame
        }, {headers: { authorization: `Dhai ${getCookie("tkn")}`}}); 

            window.location.reload();

    }

    return(
        <><div className="centraOrizzontale centra">
            <Button className="rounded-md font-bold hover:bg-neutral-300 mb-5 mt-2" onClick={handleClick} aria-label="Conferma" >CONFERMA DATA PER DARE ESAME</Button>
        </div>
        </>
    )
}





const formattaData = (date,label=false) => {
    
    const parsedDate = moment(date, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.SSSZ"], true);
  
    let dataFormattata ;

    if (parsedDate.isValid()) {

        if(label){
         dataFormattata = (date.toString()).split("-");

        const mese = dataFormattata[1];
        const giorno = dataFormattata[2];

        switch (mese) {
            case "01":
                dataFormattata = giorno + " " + "Gennaio";
                break;

            case "02":
                dataFormattata = giorno + " " + "Febbraio";
                break;

            case "03":
                dataFormattata = giorno + " " + "Marzo";
                break;

            case "04":
                dataFormattata = giorno + " " + "Aprile";
                break;

            case "05":
                dataFormattata = giorno + " " + "Maggio";
                break;

            case "06":
                dataFormattata = giorno + " " + "Giugno";
                break;

            case "07":
                dataFormattata = giorno + " " + "Luglio";
                break;

            case "08":
                dataFormattata = giorno + " " + "Agosto";
                break;

            case "09":
                dataFormattata = giorno + " " + "Settembre";
                break;

            case "10":
                dataFormattata = giorno + " " + "Ottobre";
                break;

            case "11":
                dataFormattata = giorno + " " + "Novembre";
                break;

            case "12":
                dataFormattata = giorno + " " + "Dicembre";
                break;

            default:
                dataFormattata = " ";
                break;
        }

        return dataFormattata;
    }else{

        dataFormattata =  parsedDate.format("DD/MM/YYYY");
        return dataFormattata;
    }

    } else {
        return "";
    }

}


export default Exams;