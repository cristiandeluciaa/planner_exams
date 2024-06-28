import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";


const prisma = new PrismaClient;

const editWeeklyPlanner = async (req, res) => {

    try {
        
    const tknDecoded = Middleware(req.headers.authorization);

    if(tknDecoded){

        const weekly_planner = {
            L6: req.body.gg.L6,
            L7: req.body.gg.L7,
            L8: req.body.gg.L8,
            L9: req.body.gg.L9,
            L10: req.body.gg.L10,
            L11: req.body.gg.L11,
            L12: req.body.gg.L12,
            L13: req.body.gg.L13,
            L14: req.body.gg.L14,
            L15: req.body.gg.L15,
            L16: req.body.gg.L16,
            L17: req.body.gg.L17,
            L18: req.body.gg.L18,
            L19: req.body.gg.L19,
            M6: req.body.gg.M6,
            M7: req.body.gg.M7,
            M8: req.body.gg.M8,
            M9: req.body.gg.M9,
            M10: req.body.gg.M10,
            M11: req.body.gg.M11,
            M12: req.body.gg.M12,
            M13: req.body.gg.M13,
            M14: req.body.gg.M14,
            M15: req.body.gg.M15,
            M16: req.body.gg.M16,
            M17: req.body.gg.M17,
            M18: req.body.gg.M18,
            M19: req.body.gg.M19,
            ME6: req.body.gg.ME6,
            ME7: req.body.gg.ME7,
            ME8: req.body.gg.ME8,
            ME9: req.body.gg.ME9,
            ME10: req.body.gg.ME10,
            ME11: req.body.gg.ME11,
            ME12: req.body.gg.ME12,
            ME13: req.body.gg.ME13,
            ME14: req.body.gg.ME14,
            ME15: req.body.gg.ME15,
            ME16: req.body.gg.ME16,
            ME17: req.body.gg.ME17,
            ME18: req.body.gg.ME18,
            ME19: req.body.gg.ME19,
            G6: req.body.gg.G6,
            G7: req.body.gg.G7,
            G8: req.body.gg.G8,
            G9: req.body.gg.G9,
            G10: req.body.gg.G10,
            G11: req.body.gg.G11,
            G12: req.body.gg.G12,
            G13: req.body.gg.G13,
            G14: req.body.gg.G14,
            G15: req.body.gg.G15,
            G16: req.body.gg.G16,
            G17: req.body.gg.G17,
            G18: req.body.gg.G18,
            G19: req.body.gg.G19,
            V6: req.body.gg.V6,
            V7: req.body.gg.V7,
            V8: req.body.gg.V8,
            V9: req.body.gg.V9,
            V10: req.body.gg.V10,
            V11: req.body.gg.V11,
            V12: req.body.gg.V12,
            V13: req.body.gg.V13,
            V14: req.body.gg.V14,
            V15: req.body.gg.V15,
            V16: req.body.gg.V16,
            V17: req.body.gg.V17,
            V18: req.body.gg.V18,
            V19: req.body.gg.V19,
            S6: req.body.gg.S6,
            S7: req.body.gg.S7,
            S8: req.body.gg.S8,
            S9: req.body.gg.S9,
            S10: req.body.gg.S10,
            S11: req.body.gg.S11,
            S12: req.body.gg.S12,
            S13: req.body.gg.S13,
            S14: req.body.gg.S14,
            S15: req.body.gg.S15,
            S16: req.body.gg.S16,
            S17: req.body.gg.S17,
            S18: req.body.gg.S18,
            S19: req.body.gg.S19,
            D6: req.body.gg.D6,
            D7: req.body.gg.D7,
            D8: req.body.gg.D8,
            D9: req.body.gg.D9,
            D10: req.body.gg.D10,
            D11: req.body.gg.D11,
            D12: req.body.gg.D12,
            D13: req.body.gg.D13,
            D14: req.body.gg.D14,
            D15: req.body.gg.D15,
            D16: req.body.gg.D16,
            D17: req.body.gg.D17,
            D18: req.body.gg.D18,
            D19: req.body.gg.D19,
        };

        console.log(tknDecoded.Id_utente)
        const weekly_plannerEdited = await prisma.weekly_planner.update({
            where: {
                Id_utente: parseInt( tknDecoded.Id_utente )
            },
            data: weekly_planner
        })

        if (weekly_plannerEdited) {
                res.status(200).json({ success: true, message: "Weekly planner eliminato", data: weekly_plannerEdited });
        }else{
                res.status(500).json({ errore: "Problema nella modifica del weekly planner" });
        }
        
        } else {
                res.status(401).json({ error: "Unauthorized" });
        }


    } catch (e) {
        res.status(500).json({ errore: "Errore nella query " + e });
    } finally {
        await prisma.$disconnect();
    }

}

export default editWeeklyPlanner;