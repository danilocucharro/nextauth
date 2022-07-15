import { createContext, ReactNode, useState } from "react";
import Router from "next/router";
import { api } from "../services/api";

type User = {
    email: string;
    permitions: string[];
    roles: string[];
}

type SignInCredentials = {//dados que serao necessarios para a autenticação de um usuario
    email: string;
    password: string;
}

type AuthContextData = {//informaçoes que vao ter dentro do contexto de auth "informaçoes do usuario que serao salvas"
    signIn(credentials: SignInCredentials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;//ReactNode -> componente que pode receber qualquer tipo de valor
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInCredentials){
        try{
            const response = await api.post('sessions', {
                email,
                password,
            })

            const { token, refreshToken, permitions, roles } = response.data;
    
            setUser({
                email,
                permitions,
                roles,
            })

            Router.push('/dashboard');
        } catch(err){
            console.log(err);
        }
    }

    return(
        <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}