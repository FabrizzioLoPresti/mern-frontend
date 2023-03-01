import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const Registrar = () => {

  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleChangeUser = e => {
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

    if(usuario.password !== repetirPassword) return setAlerta({
      msg: 'Los passwords no coinciden',
      error: true
    })

    if(usuario.password.length < 6) return setAlerta({
      msg: 'El password es muy corto, minimo 6 caracteres',
      error: true
    })
  
    setAlerta({})
    try {
      const { data: {msg} } = await clienteAxios.post('/usuarios', usuario)
      setAlerta({
        msg,
        error: false
      })
      setUsuario({
        nombre: '',
        email: '',
        password: '',
      })
      setRepetirPassword('')
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
        Crea tu Cuenta y Administra tus <span className="text-slate-700">Proyectos</span>
      </h1>

      {alerta.msg && <Alerta alerta={alerta}/>}
      <form 
        className="mt-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">
            Nombre
          </label>
          <input 
            type="text" 
            name="nombre" 
            id="nombre"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={usuario.nombre}
            onChange={handleChangeUser}
          />
        </div>

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
            onChange={handleChangeUser}
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
            autoComplete="on"
            value={usuario.password}
            onChange={handleChangeUser}
          />
        </div>

        <div className="my-5">
          <label htmlFor="repetirPassword" className="uppercase text-gray-600 block text-xl font-bold">
            Repetir Password
          </label>
          <input 
            type="password" 
            name="repetirPassword" 
            id="repetirPassword"
            placeholder="Repetir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            autoComplete="on"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit" 
          value="Crear Cuenta" 
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"  
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          to={'/'} 
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿Ya tienes una cuenta? Inicia Sesion 
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

export default Registrar