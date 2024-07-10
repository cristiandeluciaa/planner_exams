import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "../../lib/cookieUtils";

const CheckAuthComponent = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const tknLocal = getCookie("tkn");

                if (!tknLocal) {
                    router.push("/login");
                    return;
                }

                const tokenVerificato = await jwt.verify(tknLocal, process.env.JWT_KEY);

                if (!tokenVerificato) {
                    router.push("/login");
                }
            } catch (error) {
                //console.log("Si sono verificati errori nel controllo:", error.message);
                // Gestire l'errore in base alle necessità (es. reindirizzamento a /login con messaggio di errore)
                router.push("/login");
            }
        };

        checkAuth();
    }, []);

    return <>{children}</>;
};

export default CheckAuthComponent;
