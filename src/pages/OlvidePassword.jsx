import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import validarEmail from "../helpers/validarEmail"

const OlvidePassword = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({
    msg: '',
    error: false
  })

  const handleSubmit = async e => {
    e.preventDefault()

    if(email === '' || email.length < 6) return setAlerta({
      msg: 'Ingrese un email correcto',
      error: true
    })

    if(!validarEmail(email)) return setAlerta({
      msg: 'Ingrese un formato de mail correcto',
      error: true
    })

    try {
      const { data: {msg} } = await clienteAxios.post('/usuarios/forget-password', {
        email
      })
      setAlerta({
        msg,
        error: false
      })
    } catch (error) {
      console.log( error.response )
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
        Recupera tu Acceso y no pierdas tus <span className="text-slate-700">Proyectos</span>
      </h1>

      <form 
        className="mt-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}  
      >
        {alerta.msg && <Alerta alerta={alerta} />}
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
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <input 
          type="submit" 
          value="Enviar instrucciones" 
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
          to={'/registrar'} 
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿No tienes una cuenta? Registrate 
        </Link>
      </nav>
    </>
  )
}

export default OlvidePassword