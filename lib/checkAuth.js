import { useEffect } from "react";
import  jwt  from "jsonwebtoken";
import { env } from "process";

export const Middleware = (token) => {

    const tkn = token?.replace('Dhai ', '');
                if(!tkn){
                    return  false
                }
                const tokenVerificato = jwt.verify(tkn,process.env.JWT_KEY);
                    if(!tokenVerificato){
                        return  false
                    }
                    
    return jwt.decode(tkn);

}