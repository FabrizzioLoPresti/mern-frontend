import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"
import validarEmail from "../helpers/validarEmail"

const FormularioColaborador = () => {

  const [email, setEmail] = useState('')
  const { alerta, mostrarAlerta, submitColaborador } = useProyectos()

  const handleSubmit = e => {
    e.preventDefault()

    if(email === '' || !validarEmail(email)) return mostrarAlerta({
      msg: 'Ingrese un formato de e-mail valido',
      error: true
    })

    submitColaborador(email)
  }

  return (
    <form
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {alerta.msg && <Alerta alerta={alerta} />}
      <div className='mb-5'>
        <label 
          htmlFor="email"
          className='text-gray-700 uppercase font-bold text-sm'  
        >
          E-Mail Colaborador
        </label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          placeholder='E-Mail del Usuario'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div> {/* Campo */}
      <input 
        type="submit" 
        value='Buscar Colaborador'
        className='bg-sky-600 hover:bg-slate-700 w-full p-3 text-white text-sm uppercase font-bold cursor-pointer transition-colors rounded'
      />
    </form>
  )
}

export default FormularioColaborador