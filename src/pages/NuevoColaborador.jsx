import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import FormularioColaborador from "../components/FormularioColaborador"
import Alerta from "../components/Alerta"

const NuevoColaborador = () => {

  const { id } = useParams()
  const { proyecto, obtenerProyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos()

  useEffect(() => {
    obtenerProyecto(id)
  }, [])

  const handleAgregarColaborador = () => {
    agregarColaborador({
      email: colaborador.email
    })
  }

  // Carga toda la Pagina junta al tener la respuesta de la API, en caso contrario primero carga todo lo estatico y luego aparece la respuesta de la API
  // if(cargando) return 'Cargando'

  if(!proyecto._id) return <Alerta alerta={alerta} />

  return (
    <>
      <h1 className="text-4xl font-black">Agregar Colaborador(a) al Proyecto: {proyecto.nombre}</h1>
      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>
      {cargando ? <p className="text-center">Cargando...</p> : colaborador?._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
            <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
            <div className="flex justify-between items-center">
              <p>{colaborador.nombre}</p>
              <button
                type="button"
                className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                onClick={handleAgregarColaborador}
              >
                Agregar al Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NuevoColaborador