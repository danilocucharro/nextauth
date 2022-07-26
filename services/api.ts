import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies'
import { signOut } from "../contexts/AuthContext";

interface AxiosErrorResponse {
    code?: string;
}

let isRefreshing = false
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);//pegando todos os cookies existentes

    const api = axios.create({
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
                cookies = parseCookies(ctx);
    
                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config
                
                if(!isRefreshing) {//quando receber um token invalido -> executar o refresh
                    isRefreshing = true;
    
                    api.post('/refresh', {
                        refreshToken,
                    }).then(response =>{
                        const { token } = response.data;
        
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                            path: '/'
                        })
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                            path: '/'
                        })
        
                        api.defaults.headers['Authorization'] = `Bearer ${token}`;
    
                        failedRequestsQueue.forEach(request => request.onSuccess(token))
                        failedRequestsQueue = [];
                    }).catch(err => {
                        failedRequestsQueue.forEach(request => request.onFailure(err))
                        failedRequestsQueue = [];
    
                        if (process.browser) {
                            signOut()
                        }
                    }).finally(() =>{
                        isRefreshing = false
                    });
                }
    
                return new Promise((resolve, reject)=> {
                    failedRequestsQueue.push({
                        onSuccess: (token: string)=>{
                            originalConfig.headers['Authorization'] = `Bearer ${token}`
    
                            resolve(api(originalConfig))
                        },
                        onFailure: (err: AxiosError)=>{
                            reject(err)
                        }
                    })
                });
            } else {
                //deslogar usuario
                if (process.browser){
                    signOut()
                }
            }
        }
    
        return Promise.reject(error);
    });

    return api;
}