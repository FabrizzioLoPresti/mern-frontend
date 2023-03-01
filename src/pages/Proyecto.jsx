import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import io from 'socket.io-client'
import Placeholder from "../components/Placeholder"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import Tarea from "../components/Tarea"
import Colaborador from "../components/Colaborador"
import Alerta from "../components/Alerta"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"

let socket

const Proyecto = () => {
  const { id } = useParams()
  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTareaProyecto } = useProyectos()
  const isAdmin = useAdmin()

  useEffect(() => {
    obtenerProyecto(id)
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', id)
  }, [])

  useEffect(() => {
    socket.on('tarea agregada', tareaAgregada => {
      if(tareaAgregada.proyecto === proyecto._id) {
        submitTareasProyecto( tareaAgregada )
      }
    })

    socket.on('tarea eliminada', tareaEliminada => {
      if(tareaEliminada.proyecto._id === proyecto._id) {
        eliminarTareaProyecto( tareaEliminada )
      }
    })

    socket.on('tarea actualizada', tareaActualizada => {
      if(tareaActualizada.proyecto._id === proyecto._id) {
        actualizarTareaProyecto( tareaActualizada )
      }
    })

    socket.on('nuevo estado', nuevoEstado => {
      if(nuevoEstado.proyecto._id === proyecto._id) {
        cambiarEstadoTareaProyecto( nuevoEstado )
      }
    })

    return () => {
      socket.off('tarea agregada')
      socket.off('tarea eliminada')
      socket.off('tarea actualizada')
      socket.off('nuevo estado')
    }
  })

  const { nombre, descripcion, cliente, fechaEntrega, tareas, colaboradores } = proyecto
  // TODO Cuando usar el Optional Chaining - ChatGPT

  return (
    cargando ? (
      <Placeholder />
    ) : (
      <>
        <div className="flex justify-between items-center">
          <h1 className="font-black text-4xl">{nombre}</h1>
          {isAdmin && (
            <div className="flex justify-between items-center gap-2 text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <Link to={`/proyectos/editar/${id}`} className='uppercase font-bold'>
                Editar
              </Link>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            type="button"
            className="text-sm px-5 py-3 mt-5 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center flex gap-2 items-center justify-center"
            onClick={handleModalTarea}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nueva Tarea
          </button>
        )}

        <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
        <div className="bg-white shadow mt-10 rounded-lg">
          {tareas?.length ? (
            tareas.map(tarea => (
              <Tarea key={tarea._id} tarea={tarea} />
            ))
          ) : (
            <p className="text-center my-5 p-10">No hay Tareas en este Proyecto</p>
          )}
        </div>
        
        {isAdmin && (
          <>
            <div className="flex items-center justify-between mt-10">
              <p className="font-bold text-xl">Colaboradores</p>
              <Link
                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                className='text-gray-400 hover:text-black uppercase font-bold'
              >
                Agregar
              </Link>
            </div>
            <div className="bg-white shadow mt-10 rounded-lg">
              {colaboradores?.length ? (
                colaboradores.map(colaborador => (
                  <Colaborador key={colaborador._id} colaborador={colaborador} />
                ))
              ) : (
                <p className="text-center my-5 p-10">No hay Colaboradores en este Proyecto</p>
              )}
            </div>
          </>
        )}

        <ModalFormularioTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />
      </>
    )
  )
}

export default Proyecto