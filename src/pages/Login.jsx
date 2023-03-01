import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {

  const { handleLogin } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState({
    email: '',
    password: ''
  })
  const [alerta, setAlerta] = useState({
    msg: '',
    error: false
  })

  const handleChangeUsuario = e => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if(Object.values(usuario).includes('')) return setAlerta({
      msg: 'Todos los campos son obligatorios',
      error: true
    })

    try {
      const { data } = await clienteAxios.post('/usuarios/login', usuario)
      const { token } = data

      setAlerta({})
      localStorage.setItem('token', token)
      handleLogin(data)
      navigate('/proyectos')
    } catch (error) {
      const { data: {msg} } = error.response
      setAlerta({
        msg,
        error: true
      })
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia Sesion y Administra tus <span className="text-slate-700">Proyectos</span>
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}
      <form 
        className="mt-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">
            E-Mail
          </label>
          <input 
            type="email" 
            name="email" 
            id="email"
            placeholder="E-Mail de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={usuario.email}
            onChange={handleChangeUsuario}
          />
        </div>

        <div className="my-5">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">
            Password
          </label>
          <input 
            type="password" 
            name="password" 
            id="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            autoComplete="true"
            value={usuario.password}
            onChange={handleChangeUsuario}
          />
        </div>
        <input 
          type="submit" 
          value="Iniciar Sesion" 
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"  
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          to={'/registrar'} 
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿No tienes una cuenta? Registrate 
        </Link>
        <Link 
          to={'/olvide-password'} 
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Olvide mi password 
        </Link>
      </nav>
    </>
  )
}

export default Login