import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();

const findAllExams = async (req,res) => {
    
        const findExams = await prisma.exams.findMany({
            where : {
                Id_utente : 1
            }
        });

        if(Middleware(req.headers.authorization)){
            res.status(200).json({success:true,message:"Trovati esami",data:findExams});
        }else{
            res.status(401).json({error: "Unauthorized"});
        } 
    
 }


export default findAllExams;