import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();

const findAllExams = async (req,res) => {

        const tknDecoded = Middleware(req.headers.authorization);
        let anno_universitario = "";

        if(tknDecoded){

            if(req.body.anno_universitario!="" && req.body.anno_universitario!=null && req.body.anno_universitario!=undefined ){
                anno_universitario = req.body.anno_universitario;
            }else{
                anno_universitario = "";
            }
            


            if(anno_universitario != "" ){

            const findExamsFiltred = await prisma.exams.findMany({
                where : {
                    Id_utente : tknDecoded.Id_utente,
                    Anno_universitario : anno_universitario
                }
            });
            res.status(200).json({success:true,message:"Trovati esami",data:findExamsFiltred});
        
        }else{

            const findExams = await prisma.exams.findMany({
                where : {
                    Id_utente : tknDecoded.Id_utente,
                    }
            });
            res.status(200).json({success:true,message:"Trovati esami",data:findExams});    
        }

             
        }else{
            res.status(401).json({error: "Unauthorized"});
        } 
    
 }


export default findAllExams;