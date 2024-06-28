import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();

const findAllExams = async (req,res) => {

        const tknDecoded = Middleware(req.headers.authorization);
        let annoMin = "";
        let annoMax = "";

        if(tknDecoded){

            if(req.body.annoMin!="" && req.body.annoMin!=null && req.body.annoMin!=undefined ){
                annoMin = req.body.annoMin;
            }

            if(req.body.annoMax!="" && req.body.annoMax!=null && req.body.annoMax!=undefined ){
                annoMax = req.body.annoMax;
            }
            
            const findExams = await prisma.exams.findMany({
                where : {
                    Id_utente : tknDecoded.Id_utente,
                    }
            });

            if(annoMin != "" && annoMax != ""){
                const dataMin = new Date(annoMin+"-09-01") ;
                const dataMax = new Date(annoMax+"-08-31") ;

                const findExamsFiltred = findExams.map((exam)=>{ 
                if( (exam.Data1 >= dataMin && exam.Data1 <= dataMax) &&
                (exam.Data2 >= dataMin && exam.Data2 <= dataMax) &&
                (exam.Data3 >= dataMin && exam.Data3 <= dataMax) &&
                (exam.Data4 >= dataMin && exam.Data4 <= dataMax) ){
                    return exam;
                }else{
                    return false
                }
            })
            
            res.status(200).json({success:true,message:"Trovati esami",data:findExamsFiltred});
        
        }else{
            res.status(200).json({success:true,message:"Trovati esami",data:findExams});    
        }

             
        }else{
            res.status(401).json({error: "Unauthorized"});
        } 
    
 }


export default findAllExams;