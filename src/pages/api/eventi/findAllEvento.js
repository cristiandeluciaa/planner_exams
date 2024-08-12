import { PrismaClient } from "@prisma/client"
import { Middleware } from "../../../../lib/checkAuth";

const FindAllEvento = async (req,res) => {

    const tknDecoded = Middleware(req.headers.authorization);

    if(tknDecoded){
        
        const prisma = new PrismaClient();

        const allEvents = await prisma.eventi.findMany({
            where: {
                Id_utente : tknDecoded.Id_utente ?? null
            },
            orderBy: {
                Data: "asc"
            }
        });

        await prisma.$disconnect();
        
        if(allEvents){
            res.status(200).json({success : true, message : "Events finded", data: allEvents})
        }else{
            res.status(501).json({error: "Problems finding events"});
        }

    }else{
        res.status(500).json({error: "Unauthorized"});
    }
}

export default FindAllEvento;