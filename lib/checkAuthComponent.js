import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { getCookie } from "./cookieUtils";

 const CheckAuthComponent = (router) =>{
    
    try {
        const tknLocal = getCookie("tkn");
        if (!tknLocal) {
            router.push("/login");
            return;
        }

        const tokenVerificato =  jwt.verify(tknLocal, process.env.JWT_KEY);

        if (!tokenVerificato) {
            router.push("/login");
        }
    } catch (error) {
        // console.log("Si sono verificati errori nel controllo:", error.message);
        // Gestire l'errore in base alle necessità (es. reindirizzamento a /login con messaggio di errore)
       // router.push("/login");
    }
}

export default CheckAuthComponent;