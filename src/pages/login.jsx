import { useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";


const Login = () => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [token, setToken] = useState("");
    const [mode, setMode] = useState("login");

    const router = useRouter();

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleToken = (e) => {
        setToken(e.target.value);
    }

    const submitLogin = async () => {

        try {

            if (mode=="login") {
                const res = await axios.post("/api/utenti/login",
                    {
                        username: username,
                        password: password
                    });

                if (res.data) {
                    setMode("checkToken");
                } else {
                    alert("Errore nell'autenticazione");
                }
            } else if(mode == "checkToken"){
                if(e.target.value=="" || e.target.value==null || e.target.value==undefined ){
                    alert("Inserire il token!");
                }else{
                const res = await axios.post("/api/utenti/login",
                    {
                        username: username,
                        password: password,
                        token: token
                    });

                if (res.data) {
                    document.cookie = "tkn="+res.data+";"+ "max-age=3600;path=/";
                    router.push("/planner");
                } else {
                    alert("Errore nell'autenticazione");
                }
            }
            }

        } catch (e) {
            alert("Errore nell'autenticazione");
        }

    }

    return (
        <>
            <div className="centra loginContainer">
                {
                    (mode == "login") ? (
                        <div className="bg-grayContainerExams centra rounded-3xl w-2/6 h-3/6">
                            <h1 className="titoloLogin font-bold h-1/6">LOGIN</h1>
                            <div className="centra inputLogin">
                                <label>USERNAME</label>
                                <input type="text" className="rounded-2xl"  value={username} onChange={handleUsername} placeholder="Inserisci username" />
                            </div>
                            <div className="centra inputLogin">
                                <label>PASSWORD</label>
                                <input type="password" className="rounded-2xl"  value={password} onChange={handlePassword} placeholder="Inserisci password" />
                            </div>
                            <div className="centra inputLogin">
                            <Button type="submit" className="bg-grayContainerHome" onClick={submitLogin} >ACCEDI</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-grayContainerExams centra rounded-3xl w-2/6 h-2/6">
                            <h1 className="titoloLoginToken font-bold h-1/6">CODICE DI VERIFICA</h1>
                            <div className="centra inputLoginToken">
                                <label>TOKEN</label>
                                <input className="rounded-2xl" type="text" value={token} onChange={handleToken} placeholder="Inserisci token" />
                                <Button type="submit" className="bg-grayContainerHome" onClick={submitLogin} >CONFERMA</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Login;