import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css'

export default function Home(){
  const [email, setEmail] = useState('');//salvando o valor do input dentro do estado
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent){
    event.preventDefault();//mantendo o usuario na emsma pagina depois do submit dos dados
    const data = {//pegar dados de email e senha dentro do useState
      email,
      password,
    }

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}