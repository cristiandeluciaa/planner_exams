import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();

const deleteExam = async (req,res) => {

        const tknDecoded = Middleware(req.headers.authorization);

        if(tknDecoded){
            const examDeleted = await prisma.exams.delete({
                where : {
                    Id_esame : req.body.Id_esame
                }
            });

            res.status(200).json({success:true,message:"Esame eliminato"});

        }else{
            res.status(401).json({error: "Unauthorized"});
        } 
    
 }


export default deleteExam;