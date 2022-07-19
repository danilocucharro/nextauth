import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies'

interface AxiosErrorResponse {
    code?: string;
}

let cookies = parseCookies();//pegando todos os cookies existentes

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
});

api.interceptors.response.use(response =>{
    return response;
}, (error: AxiosError<AxiosErrorResponse>) => {
    if(error.response.status === 401){
        if(error.response.data?.code === 'token.expired' ){
            //renover o code
            cookies = parseCookies();

            const { 'nextauth.refreshToken': refreshToken } = cookies;
            
            api.post('/refresh', {
                refreshToken,
            }).then(response =>{
                const { token } = response.data;

                setCookie(undefined, 'nextauth.token', token, {
                    maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                    path: '/'
                })
                setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                    maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                    path: '/'
                })

                api.defaults.headers['Authorization'] = `Bearer ${token}`;
            });
        } else {
            //deslogar usuario

        }
    }
})