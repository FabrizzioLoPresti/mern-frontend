import formatearFechaTarea from "../helpers/formatearFechaTarea"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()
  const isAdmin = useAdmin()
  const { _id, nombre, descripcion, fechaEntrega, prioridad, estado, completado } = tarea

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-sm">{formatearFechaTarea(fechaEntrega)}</p>
        <p className="mb-1 text-gray-600">{prioridad}</p>
        {estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completada por: {completado.nombre}</p>}
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {isAdmin && (
          <button
            type="button"
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEditarTarea(tarea)}
          >
            Editar
          </button>
        )}
        <button
          type="button"
          className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completarTarea(_id)}
        >
          {estado ? 'Completa'  : 'Incompleta'}
        </button>
        {isAdmin && (
          <button
            type="button"
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}

export default Tarea