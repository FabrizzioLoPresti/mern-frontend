import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const ConfirmarCuenta = () => {

  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
  const { token } = useParams()
  const [alerta, setAlerta] = useState({
    msg: '',
    error: false
  })

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const { data: {msg} } = await clienteAxios.get(`/usuarios/confirmar/${token}`)
        setAlerta({
          msg,
          error: false
        })
        setCuentaConfirmada(true)
      } catch (error) {
        const { data: {msg} } = error.response
        setAlerta({
          msg,
          error: true
        })
        setCuentaConfirmada(false)
      }
    }
    confirmarCuenta()
  }, [])
  
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y comienza a crear tus <span className="text-slate-700">Proyectos</span>
      </h1>
      
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {alerta.msg && <Alerta alerta={alerta}/>}
        {cuentaConfirmada && 
          <Link 
            to={'/'} 
            className='block text-center my-5 text-slate-500 uppercase text-sm'
          >
            Inicia Sesion 
          </Link>
        }
      </div>
    </>
  )
}

export default ConfirmarCuenta