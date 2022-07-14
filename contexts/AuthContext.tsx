import { createContext, ReactNode } from "react";

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
        console.log({ email, password })
    }

    return(
        <AuthContext.Provider value={{ signIn, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}