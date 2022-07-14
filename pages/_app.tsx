import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {// informaçoes que serao compartilhadas em todas paginas
  return (
    //agora todos os componentes vão ter informações da autenticação do usuario pelo <AuthProvider>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
