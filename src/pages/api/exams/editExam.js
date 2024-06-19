import { PrismaClient } from "@prisma/client";
import { Middleware } from "../../../../lib/checkAuth";

const prisma = new PrismaClient();


const editExam = async (req,res) => {

    let dataExam = [];

    try{  
        if(req.body.Materia){
            dataExam["Materia"] = req.body.Materia;
        }
        if(req.body.CFU){
            dataExam["CFU"] = parseFloat(req.body.CFU);
        }
        if(req.body.Voto){
            dataExam["Voto"] = parseFloat(req.body.Voto);
        }
        if(req.body.Voto == ""){
            dataExam["Voto"] = null;
        }
        if(req.body.Id_utente){
            dataExam["Id_utente"] = req.body.Id_utente;
        }
        if(req.body.Scelta){
            dataExam["Scelta"] = req.body.Scelta;
        }
        if(req.body.Data1){
            dataExam["Data1"]= new Date(req.body.Data1.year, req.body.Data1.month - 1, req.body.Data1.day+1).toISOString();
        }
        if(req.body.Data2){
            dataExam["Data2"]= new Date(req.body.Data2.year, req.body.Data2.month - 1, req.body.Data2.day+1).toISOString(); 
        }
        if(req.body.Data3){
            dataExam["Data3"]= new Date(req.body.Data3.year, req.body.Data3.month - 1, req.body.Data3.day+1).toISOString(); 
        }
        if(req.body.Data4){
            dataExam["Data4"]= new Date(req.body.Data4.year, req.body.Data4.month - 1, req.body.Data4.day+1).toISOString(); 
        }
    /*  if(isDate(req.body.Data5)){
            data["Data5"] = new Date(req.body.Data5.year, req.body.Data5.month - 1, req.body.Data5.day).toISOString(); 
        } */
        
        const examEdited = await prisma.exams.update({
            where : {
                Id_esame : req.body.Id_esame
            },
            data : {
                ...dataExam
            }
        });

        if(Middleware(req.headers.authorization)){
            res.status(200).json({success: true, message: "Esame modificato", data: examEdited});
        }else{
            res.status(401).json({error: "Unauthorized"});
        } 
        
    }catch (e) {
        res.status(500).json({error: "Errore nella modifica dell'esame : " + e});
    }
}

export default editExam;