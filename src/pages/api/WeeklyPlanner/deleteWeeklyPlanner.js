import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient;

const deleteWeeklyPlanner = async (req, res) => {

    try {

        const weekly_plannerDeleted = await prisma.weekly_planner.delete({
            where: {
                Id_utente: req.body.Id_utente
            }
        })

        if (weekly_plannerDeleted) {
            if(Middleware(req.headers.authorization)){
                res.status(200).json({ success: true, message: "Weekly planner eliminato", data: weekly_plannerDeleted });
            }else{
                res.status(401).json({error: "Unauthorized"});
            } 
        } else {
            res.status(500).json({ errore: "Problema nella eliminazione del weekly planner" });
        }

    } catch (e) {
        res.status(500).json({ errore: "Errore nella query " + e });
    } finally {
        await prisma.$disconnect();
    }

}

export default deleteWeeklyPlanner;