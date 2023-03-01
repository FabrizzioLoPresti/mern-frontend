import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"

const AuthContext = createContext()

const AuthProvider = ({children}) => {

  const [auth, setAuth] = useState({})
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      if(!token) return setCargando(false)

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
        const { data } = await clienteAxios.get('/usuarios/perfil', config)
        setAuth( data )
        // navigate('/proyectos') // Es aqui que cuando recargamos pagina nos envia siempre a /proyectos, debido a que cada vez que recargamos valida auntenticidad y si es valida redirecciona
      } catch (error) {
        setAuth({}) // en caso de que alla algo anteriormente por haber expirado token o x
        console.log( error )
        // Alerta Error al autenticar
      } finally {
        setCargando(false)
      }
    }
    autenticarUsuario()
  }, [])

  const handleLogin = data => {
    setAuth(data)
  }

  const cerrarSesionAuth = () => {
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        handleLogin,
        cargando,
        cerrarSesionAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
export {
  AuthProvider
}