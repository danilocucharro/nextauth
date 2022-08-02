import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies' 
import Router from 'next/router';
import { api } from "../services/apiClient";

type User = {//dados que o usuario terá
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {//dados que serao necessarios para a autenticação de um usuario
    email: string;
    password: string;
}

type AuthContextData = {//informaçoes que vao ter dentro do contexto de auth "informaçoes do usuario que serao salvas"
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    user: User;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;//ReactNode -> componente que pode receber qualquer tipo de valor
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut(){
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut');

    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() =>{
        authChannel = new BroadcastChannel('auth')

        authChannel.onmessage = (message) =>{
            switch (message.data) {
                case 'signOut':
                    signOut();
                    break;
                default:
                    break;
            }
        }
    },[])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()//devolvendo uma lista de todos o cokkies que estão salvos

        if (token){//se tiver um novo token salvo no storage
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data //pegando os dados do usuario da rota do server

                setUser({ email, permissions, roles }) //setando os dados resgatados
            })
            .catch(() =>{
                signOut();
            })
        }
    }, [])

    async function signIn({ email, password }: SignInCredentials){
        try{
            const response = await api.post('sessions', {
                email,
                password,
            })

            const { token, refreshToken, permissions, roles } = response.data;
    
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // tempo maximo que o cookie vai existir
                path: '/'
            })

            setUser({
                email,
                permissions,
                roles,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            Router.push('/dashboard');
        } catch(err){
            console.log(err);
        }
    }

    return(
        <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}