import { createContext, ReactNode } from "react";
import { api } from "../services/api";

type SignInCredentials = {//dados que serao necessarios para a autenticação de um usuario
    email: string;
    password: string;
}

type AuthContextData = {//informaçoes que vao ter dentro do contexto de auth "informaçoes do usuario que serao salvas"
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;//ReactNode -> componente que pode receber qualquer tipo de valor
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){
    const isAuthenticated = false;

    async function signIn({ email, password }: SignInCredentials){
        try{
            const response = await api.post('sessions', {
                email,
                password,
            })
    
            console.log(response.data);
        } catch(err){
            console.log(err);
        }
    }

    return(
        <AuthContext.Provider value={{ signIn, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}