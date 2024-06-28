import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import HomeLogo from "./homeLogo";
import axios from "axios";
import ggWeeklyPlanner from "../values/ggWeeklyPlanner";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { getCookie } from "../../lib/cookieUtils";
import { useRouter } from "next/router";

function formatOrari(orario){

    return orario.toString().padStart(2,"0")+":00";
    
}

function Weekly_planner(){

    const [stato,setStato] = useState("MODIFICA");
    const [existPlanner,setExistPlanner] = useState(true);
    const [inputDisabled,setInputDisabled] = useState(true);
    const router = useRouter();
    
    const [GG,setGG] = useState(ggWeeklyPlanner)

    const orari = [];
    for(let i = 6; i<20; i++ ){
            orari.push(i.toString());            
    }

    const giorniHeader = ["LUN","MAR","MER","GIO","VEN","SAB","DOM"];
    const giorni = ["L","M","ME","G","V","S","D"];
    
    const handleGGValue = (e,giorno) =>{

        setGG(prevState => ({
            ...prevState,
            [giorno] : e.target.value
        }));
    
    }

    const createWeeklyPlanner = async () => {

        const createWeeklyPlannerRespnse = await axios.post("/api/WeeklyPlanner/createWeeklyPlanner",{
            gg : GG
        }, {headers: { authorization: `Dhai ${getCookie("tkn")}`}});

        if(createWeeklyPlannerRespnse.data.success){
            alert("Planner aggiornato con successo!");
            setInputDisabled(true);
            setStato("MODIFICA");
        }else{
            alert("Errori nell'aggiornamento del planner");
        }
    }

    const editWeeklyPlanner = async () => {

        const editWeeklyPlannerRespnse = await axios.post("/api/WeeklyPlanner/editWeeklyPlanner",{
            gg : GG
        }, {headers: { authorization: `Dhai ${getCookie("tkn")}`}});

        if(editWeeklyPlannerRespnse.data.success){
            //alert("Planner aggiornato con successo!");
            setInputDisabled(true);
            setStato("MODIFICA");
        }else{
            alert("Errori nell'aggiornamento del planner");
        }
    }

    const submitGrid = () => {
        if(!existPlanner){
            createWeeklyPlanner();
        }else{
            editWeeklyPlanner();
        }
    }

    useEffect(()=>{
        const fetchWeekly_planners = async () =>{
            try {
                const plannersResponse = await fetch(`/api/WeeklyPlanner/findAllWeeklyPlanner`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        authorization: `Dhai ${getCookie("tkn")}`
                    }
                });

                if (!plannersResponse.ok) {
                    setExistPlanner(false);
                }else{

                    const plannersData = await plannersResponse.json();
                    setGG(plannersData);

                }

            } catch (error) {
                console.error('Si è verificato un errore durante il recupero dei dati:', error);
            }
        }

        CheckAuthComponent(router);
        fetchWeekly_planners();
         
    },[])



    return(
        <div>
        <div className="centraOrizzontale centra">
        <span className="w-1/4 homeLogo"><HomeLogo/></span><h1 className="py-6 text-center text-5xl w-2/4"> <b>WEEKLY</b> <span className="font-light">PLANNER</span></h1><span className="w-1/4"> </span>
            </div>
            <table className="tableWeeklyPlanner">
                <thead>
                    <tr>
                        <th className="tdWeeklyPlanner border-none " ><Button color="default" variant="flat" className="w-full text-xl rounded-md font-bold hover:bg-neutral-300"  onClick={()=>{if(stato == "MODIFICA" ){setStato("SALVA"); setInputDisabled(false); }else{submitGrid()}}}>{stato}</Button></th>
                        {
                            giorniHeader.map((giornoHeader, indexHeader)=>(
                                <th className="tdWeeklyPlanner py-2 text-lg bg-neutral-300" key={indexHeader}>{giornoHeader}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        orari.map((orario, indexOrario)=>(
                            <tr key={indexOrario}>
                                <td className="tdWeeklyPlanner" >{formatOrari(orario)}</td>
                                {
                                    giorni.map((giorno, indexGiorno)=>(
                                        <td className="tdWeeklyPlanner" key={indexGiorno}><input type="text" disabled={inputDisabled} value={GG[giorno.toString()+orario.toString()]} onChange={(e)=> handleGGValue(e,giorno+orario)} className="w-full h-full border-none inputWeeklyPlanner"/></td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )

}

export default Weekly_planner
