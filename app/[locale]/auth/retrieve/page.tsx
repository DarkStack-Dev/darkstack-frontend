import { RetrievePage } from "@/components/Pages/Auth/Retrieve";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recuperar Senha"
}
const Retrieve = () => {
    return (
        <>
            <RetrievePage />
        </>
    )
}
export default Retrieve;