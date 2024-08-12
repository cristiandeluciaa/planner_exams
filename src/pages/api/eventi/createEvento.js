import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();

const CreateEvento = async (req,res) =>{

    const tknDecoded = Middleware(req.headers.authorization);

    if(tknDecoded){
        const eventoCreato = await prisma.eventi.create({
            data: {
                Evento: req.body.evento ?? null,
                Descrizione: req.body.descrizione ?? null,
                Categoria: req.body.categoria ?? null,
                Data: req.body.dataEvento ?? null,
                Id_utente : tknDecoded.Id_utente ?? null
            }
        });
        
        await prisma.$disconnect();
        res.status(200).json({success : true ,message : "Esame creato", data : eventoCreato});
    }else{
        res.status(401).json({error: "Unauthorized"});
    }

}

export default CreateEvento;