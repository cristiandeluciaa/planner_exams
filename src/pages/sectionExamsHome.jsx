import Link from "next/link";
import CheckAuthComponent from "../../lib/checkAuthComponent";
import { useRouter } from "next/router";
import { useEffect } from "react";

function SectionExamsHome() {

    const router = useRouter();

    useEffect(()=>{
        CheckAuthComponent(router);
    },[]);

    return (
        <div className=" h-full centra containerExam">
            <Link  className="font-bold bg-greyExamsComponent rounded-2xl centra esameButton" href="/exams">ESAMI</Link>
            <Link  className="font-bold bg-greyExamsComponent rounded-2xl centra weeklyPlannerButton" href="/weekly_planner">WEEKLY PLANNER</Link>
        </div>
    )
}

export default SectionExamsHome;