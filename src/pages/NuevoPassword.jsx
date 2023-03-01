import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const NuevoPassword = () => {

  const { token } = useParams()
  const [tokenValido, setTokenValido] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)
  const [alerta, setAlerta] = useState({})

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const url = `/usuarios/forget-password/${token}`
        await clienteAxios.get(url)
        setTokenValido(true)
      } catch (error) {
        const { data: {msg} } = error.response
        setAlerta({
          msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if(password.length < 6) return setAlerta({
      msg: 'Minimo 6 caracteres',
      error: true
    })

    try {
      const url = `/usuarios/forget-password/${token}`
      const { data: {msg} } = await clienteAxios.post(url, {password})
      setAlerta({
        msg,
        error: false
      })
      setPasswordModificado(true)
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
        Restablece tu Password y no pierdas acceso a tus <span className="text-slate-700">Proyectos</span>
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}
      {tokenValido && (
        <form 
          className="mt-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}  
        >
          <div className="my-5">
            <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">
              Nuevo Password
            </label>
            <input 
              type="password" 
              name="password" 
              id="password"
              autoComplete="true"
              placeholder="Escribe tu nuevo password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit" 
            value="Restablecer password" 
            className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"  
          />
        </form>
      )}
      {passwordModificado && (
        <Link 
          to={'/'} 
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Inicia Sesion 
        </Link>
      )}
    </>
  )
}

export default NuevoPassword