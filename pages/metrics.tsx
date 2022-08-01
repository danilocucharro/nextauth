import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth"
import decode from 'jwt-decode' //pegar o token e resgatar os conteudos dentro desse token

export default function Metrics(){
    return(
        <>
            <h1>METRICS</h1>            
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
}, {
    permissions: ['metrics.list'],
    roles: ['administrator'],
})