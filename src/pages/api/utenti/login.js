import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../../lib/email"
import tokenTemplate from "../../../../emails/tokenTemplate";
import { render } from "@react-email/render"
import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Login = async (req, res) => {


    const MAX_TENTATIVI_FALLITI = 3;

    const prisma = new PrismaClient();

    const username = req.body.username;
    const password = req.body.password;
    const token = req.body.token;

    const accountBloccato = await prisma.utenti.findFirst({
        where: {
            username: username,
            bloccato: "S"
        }
    });

    if (accountBloccato && accountBloccato.lenght > 0) {
        return res.status(401).json({ error: "Account bloccato, contatta amministratore" });
    }

    const confrontoPw = await prisma.utenti.findFirst({
        where: {
            username: username
        }
    });

    const pwDB = confrontoPw["password"];

    const verify = await bcrypt.compare(password, pwDB);

    if (verify && (token == "" || token == undefined || token == null)) {

        let tokenAccesso = Math.floor((Math.random() * 100001)).toString();
        tokenAccesso = tokenAccesso.padStart(6, '0');

        await prisma.utenti.update({
            where: {
                Id_utente: confrontoPw["Id_utente"]
            },
            data: {
                tentativiAccesso: 0,
                token: tokenAccesso
            }
        });
        
        await sendEmail(
            {to: confrontoPw["Email"], subject: "Accesso a Weekly Planner", html : render(tokenTemplate(tokenAccesso))}
            );

        res.status(200).json({success:true});

    } else if (verify && token != "") {

        if (token == confrontoPw["token"]) {
            const token = jwt.sign({ Id_utente: confrontoPw["Id_utente"] }, process.env.JWT_KEY, { expiresIn: "1h" })
            
            res.status(200).json(token);
        } else {
            res.status(401).json({ error: "Errore in fase di login" });
        }

    } else {
        if (confrontoPw["tentativiAccesso"] >= MAX_TENTATIVI_FALLITI) {
            await prisma.utenti.update({
                where: {                    
                    Id_utente: confrontoPw["Id_utente"]
                },
                data: {
                    tentativiAccesso: 0,
                    bloccato: "S"
                }
            })
        } else {

            const newTentativiAccesso = confrontoPw["tentativiAccesso"] + 1;

            await prisma.utenti.update({
                where: {
                    Id_utente: confrontoPw["Id_utente"]
                },
                data: {
                    tentativiAccesso: newTentativiAccesso
                }
            });

            return res.status(401).json({ error: "Errore in fase di login" });
        }
    }

}

export default Login;

