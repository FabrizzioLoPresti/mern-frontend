import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'
import formatearFecha from '../helpers/formatearFecha'

const PRIORIDAD = [
  'Baja',
  'Media',
  'Alta'
]

const ModalFormularioTarea = () => {
  // TODO Definir mejor forma de utilizar ID en base a MongoDB
  const { id: proyecto } = useParams()
  const [task, setTask] = useState({
    id: null,
    proyecto,
    nombre: '',
    descripcion: '',
    fechaEntrega: '',
    prioridad: ''
  })
  const { modalFormularioTarea, handleModalTarea, alerta, mostrarAlerta, submitTask, tarea } = useProyectos()

  // Cada vez que tarea cambie hace un re-render del Componente ya que este nunca se desmonta
  useEffect(() => {
    if(tarea?._id) {
      return setTask({
        ...tarea,
        fechaEntrega: formatearFecha(tarea.fechaEntrega),
        id: tarea._id
      })
    }
    setTask({
      id: null,
      proyecto,
      nombre: '',
      descripcion: '',
      fechaEntrega: '',
      prioridad: ''
    })
  }, [tarea])

  const handleChangeTask = e => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    if(Object.values(task).includes('')) return mostrarAlerta({
      msg: 'Todos los campos son obligatorios',
      error: true
    })

    await submitTask( task )
    setTask({
      id: null,
      proyecto,
      nombre: '',
      descripcion: '',
      fechaEntrega: '',
      prioridad: ''
    })
  }
  
  return (
    <Transition.Root show={ modalFormularioTarea } as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={ handleModalTarea }>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={ handleModalTarea }
                >
                  <span className="sr-only">Cerrar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900">
                    {task.id ? 'Editar Tarea' : 'Crear Tarea'}
                  </Dialog.Title>
                  {alerta.msg && <Alerta alerta={alerta} />}
                  <form 
                    className='my-10'
                    onSubmit={handleSubmit}  
                  >
                    <div className='mb-5'>
                      <label 
                        htmlFor="nombre"
                        className='text-gray-700 uppercase font-bold text-sm'  
                      >
                        Nombre Tarea
                      </label>
                      <input 
                        type="text" 
                        name="nombre" 
                        id="nombre" 
                        placeholder='Nombre de la tarea'
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                        value={task.nombre}
                        onChange={handleChangeTask}
                      />
                    </div> {/* Campo */}
                    <div className='mb-5'>
                      <label 
                        htmlFor="descripcion"
                        className='text-gray-700 uppercase font-bold text-sm'  
                      >
                        Descripcion Tarea
                      </label>
                      <textarea 
                        name="descripcion" 
                        id="descripcion" 
                        placeholder='Descripcion de la tarea'
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                        value={task.descripcion}
                        onChange={handleChangeTask}
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
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                        value={task.fechaEntrega}
                        onChange={handleChangeTask}
                      />
                    </div> {/* Campo */}
                    <div className='mb-5'>
                      <label 
                        htmlFor="prioridad"
                        className='text-gray-700 uppercase font-bold text-sm'  
                      >
                        Prioridad Tarea
                      </label>
                      <select 
                        name="prioridad" 
                        id="prioridad" 
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                        value={task.prioridad}
                        onChange={handleChangeTask}
                      >
                        <option value="" disabled>--Seleccione--</option>
                        {PRIORIDAD.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </div> {/* Campo */}
                    <input 
                      type="submit" 
                      value={task.id ? 'Guardar Cambios' : 'Crear Tarea'}
                      className='bg-sky-600 hover:bg-slate-700 w-full p-3 text-white text-sm uppercase font-bold cursor-pointer transition-colors rounded'
                    />
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ModalFormularioTarea