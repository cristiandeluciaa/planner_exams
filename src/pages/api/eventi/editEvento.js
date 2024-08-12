import { Middleware } from "../../../../lib/checkAuth";
import { Prisma, PrismaClient } from "@prisma/client";

const EditEvento = async (req,res) => {
    
    const tknDecoded = Middleware(req.headers.authorization);

    if(tknDecoded){
        try{
        
        const prisma = new PrismaClient();
        
        const eventoEdited = await prisma.eventi.update({
            data:{
                Evento: req.body.evento ?? null,
                Descrizione: req.body.descrizione ?? null,
                Data: req.body.dataEvento ?? null,
                Categoria: req.body.categoria ?? null,
            },
            where : {
                Id_evento : req.body.id_evento ?? null,
                Id_utente : tknDecoded.Id_utente ?? null
            }
        })
            
            await prisma.$disconnect();
            res.status(200).json({success : true ,message : "Exam edited",data: eventoEdited});

        }catch(e){

            res.status(500).json({error:"Edit error"});
        }

    }else{
        res.status(401).json({error: "Unauthorized"});
    }

}

export default EditEvento;