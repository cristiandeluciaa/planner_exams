import { Middleware } from "../../../../lib/checkAuth";
import { PrismaClient } from "@prisma/client";

const DeleteEvento = async (req,res) => {

    const tknDecoded = Middleware(req.headers.authorization);

    if(tknDecoded){

        try{
            const prisma = new PrismaClient();
        
            const eventoDeleted = await prisma.eventi.delete({
                where : {
                    Id_evento : req.body.id_evento ?? null, 
                    Id_utente : tknDecoded.Id_utente ?? null
                }   
            });


            await prisma.$disconnect();
            res.status(200).json({success : true ,message : "Exam deleted",data: eventoDeleted});

        }catch(e){

            res.status(500).json({error:"Delete error"});

        }

    }else{
        res.status(401).json({error: "Unauthorized"})
    }

}

export default DeleteEvento;