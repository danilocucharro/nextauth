import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react"
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard(){
    const { user, signOut } = useContext(AuthContext)



    useEffect(() => {
        api.get('/me')
        .then(response => console.log(response))
        .catch(err => console.log(err));
    }, [])

    return(
        <>
            <h1>DASHBOARD: {user?.email}</h1>

            <button onClick={signOut}>Sign out</button>

            <Can permissions={['metrics.list']}>
                <div>Métricas</div>
            </Can>
            
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    console.log(response.data)

    return{
        props: {}
    }
})