import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";


const prisma = new PrismaClient();

const findWeeklyPlanner = async (req, res) => {

    try {
        const tknDecoded = Middleware(req.headers.authorization);

        if (tknDecoded) {
            
            const weekly_planner = await prisma.weekly_planner.findMany({
                where: {
                    Id_utente: tknDecoded.Id_utente
                }
            });
            if (weekly_planner.length === 0) {
                res.status(400).json({ errore: "Weekly Planner non trovato" });
            } else {
                res.status(200).json(weekly_planner[0]);
            }
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (e) {
        console.log("Errore : " + e)
    }

}

export default findWeeklyPlanner;