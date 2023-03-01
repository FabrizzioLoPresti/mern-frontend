import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'
import formatearFecha from '../helpers/formatearFecha'

const FormularioProyecto = () => {

  const params = useParams()
  const [id, setId] = useState(null)
  const { alerta, mostrarAlerta, submitProyecto, proyecto: proyectoEditar } = useProyectos()
  const [proyecto, setProyecto] = useState({
    id,
    nombre: '',
    descripcion: '',
    fechaEntrega: '',
    cliente: ''
  })

  useEffect(() => {
    if(params.id) {
      setId(params.id)
      setProyecto({
        ...proyectoEditar,
        id: proyectoEditar._id,
        fechaEntrega: formatearFecha(proyectoEditar.fechaEntrega),
      })
    }
  }, [params])

  const handleChangeProyecto = e => {
    setProyecto({
      ...proyecto,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if(Object.values(proyecto).includes('')) return mostrarAlerta({
      msg: 'Todos los campos son obligatorios',
      error: true
    })

    await submitProyecto(proyecto)
    setId(null)
    setProyecto({
      nombre: '',
      descripcion: '',
      fechaEntrega: '',
      cliente: ''
    })
  }

  return (
    <form 
      className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
      onSubmit={handleSubmit}
    >
      {alerta.msg && <Alerta alerta={alerta} />}
      <div className='mb-5'>
        <label 
          htmlFor="nombre"
          className='text-gray-700 uppercase font-bold text-sm'
        >
          Nombre Proyecto
        </label>
        <input 
          type="text" 
          name="nombre" 
          id="nombre" 
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Nombre del proyecto'
          value={proyecto.nombre}
          onChange={handleChangeProyecto}
        />
      </div> {/* Campo */}
      
      <div className='mb-5'>
        <label 
          htmlFor="descripcion"
          className='text-gray-700 uppercase font-bold text-sm'
        >
          Descripcion
        </label>
        <textarea 
          name="descripcion" 
          id="descripcion" 
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Descripcion del proyecto'
          value={proyecto.descripcion}
          onChange={handleChangeProyecto}
        />
      </div> {/* Campo */}

      <div className='mb-5'>
        <label 
          htmlFor="fecha-entrega"
          className='text-gray-700 uppercase font-bold text-sm'
        >
          Fecha de Entrega
        </label>
        <input 
          type="date" 
          name="fechaEntrega" 
          id="fecha-entrega" 
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          value={proyecto.fechaEntrega}
          onChange={handleChangeProyecto}
        />
      </div> {/* Campo */}

      <div className='mb-5'>
        <label 
          htmlFor="cliente"
          className='text-gray-700 uppercase font-bold text-sm'
        >
          Cliente
        </label>
        <input 
          type="text" 
          name="cliente" 
          id="cliente" 
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Cliente del proyecto'
          value={proyecto.cliente}
          onChange={handleChangeProyecto}
        />
      </div> {/* Campo */}

      <input 
        type="submit" 
        value={id ? 'Guardar Cambios' : 'Crear Proyecto'} 
        className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors'
      />
    </form>
  )
}

export default FormularioProyecto