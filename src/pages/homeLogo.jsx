import { Image,Link } from "@nextui-org/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import CheckAuthComponent from "../../lib/checkAuthComponent";

function HomeLogo (){

    const router = useRouter();

    useEffect(() => {
        CheckAuthComponent(router);
    }, []);

    return(
        <Link href="\planner"><Image src="home.png" alt="Logo" width={35} height={35} /></Link>
    )
}

export default HomeLogo;