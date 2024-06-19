
import Calendar from "./calendar";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import SectionExamsHome from "./sectionExamsHome";
import Grafici from "./grafici";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Planner() {
    
    const router = useRouter();

    useEffect(()=>{
        CheckAuthComponent(router);
    },[])

    return (

        <div className="containerPlanner centra" >
            <h1 className="font-semibold text-5xl text-center titoloHome tracking-widest">HOME</h1>
            <div className="containerHome bg-grayContainerHome centra w-10/12 rounded-3xl ">
                <div className="h-2/4 w-full centraOrizzontale bottoniPlanner">
                    <SectionExamsHome/>
                    <Calendar/>
                </div>
                <div className="h-2/4 w-full flex flex-col justify-center items-center grafico"> 
                <Grafici />
                    </div> 
            </div>
        </div>
    )

}

export default Planner;