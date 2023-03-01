import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"
import io from 'socket.io-client'
import useAuth from "../hooks/useAuth"
import clienteAxios from "../config/clienteAxios"

let socket

const ProyectosContext = createContext()
const ProyectosProvider = ({children}) => {

  // TODO Solucionar Alerta que sigue apareciendo en Nuevo Proyecto y setAlerta() en ObtenerProyecto

  const [proyectos, setProyectos] = useState([])
  const [proyecto, setProyecto] = useState({})
  const [alerta, setAlerta] = useState({})
  const [cargando, setCargando] = useState(false)
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
  const [tarea, setTarea] = useState({})
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
  const [colaborador, setColaborador] = useState({})
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [buscador, setBuscador] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuth()

  useEffect(() => {
    obtenerProyectos()
  }, [auth])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, [])

  const obtenerProyectos = async () => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }
      const { data: {proyectos} } = await clienteAxios.get('/proyectos', config)
      setProyectos( proyectos )
    } catch (error) {
      console.log( error )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: false
      })
    }
  }

  const mostrarAlerta = alerta => {
    setAlerta(alerta)
    setTimeout(() => {
      setAlerta({})
    }, 2500);
  }

  const submitProyecto = async proyecto => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    if(proyecto.id) {
      await actualizarProyecto(proyecto, config)
    } else {
      await crearProyecto(proyecto, config)
    }
  }

  const crearProyecto = async (proyecto, config) => {
    try {
      const { data } = await clienteAxios.post('/proyectos', proyecto, config)
      const { msg, data: dataProyecto } = data
      setProyectos([
        ...proyectos,
        dataProyecto
      ])
      mostrarAlerta({
        msg,
        error: false
      })
      setTimeout(() => {
        navigate('/proyectos')
      }, 3000)
    } catch (error) {
      console.log( error )
    }
  }

  const actualizarProyecto = async (proyecto, config) => {
    try {
      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
      setProyectos(proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState))
      mostrarAlerta({
        msg: 'Proyecto actualizado correctamente',
        error: false
      })
      setTimeout(() => {
        navigate('/proyectos')
      }, 3000)
    } catch (error) {
      console.log( error )
    }
  }

  const obtenerProyecto = async id => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }
      const { data } = await clienteAxios.get(`/proyectos/${id}`, config)
      setProyecto( data )
      setAlerta({})
    } catch (error) {
      console.log( error.response )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: true
      })
      navigate('/proyectos')
    } finally {
      setCargando(false)
    }
  }

  const eliminarProyecto = async id => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }
      const { data: {msg} } = await clienteAxios.delete(`/proyectos/${id}`, config)
      setProyectos(proyectos.filter(proyectoState => proyectoState._id !== id))
      mostrarAlerta({
        msg,
        error: false
      })
      setTimeout(() => {
        navigate('/proyectos')
      }, 3000);
    } catch (error) {
      console.log( error )
    }
  }

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  const submitTask = async task => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    if(task.id) {
      await editarTarea(task, config)
    } else {
      await crearTarea(task, config)
    }
  }

  const crearTarea = async (task, config) => {
    try {
      const { data } = await clienteAxios.post('/tareas', task, config)
      // setProyecto({
      //   ...proyecto,
      //   tareas: [
      //     ...proyecto.tareas,
      //     data
      //   ]
      // })
      setAlerta({})
      setModalFormularioTarea(false)

      // Socket.io
      socket.emit('nueva tarea', data)
    } catch (error) {
      console.log( error )
    }
  }

  const editarTarea = async (task, config) => {
    try {
      const { data } = await clienteAxios.put(`/tareas/${task.id}`, task, config)
      
      // Socket.io
      socket.emit('actualizar tarea', data)
      setAlerta({})
      setModalFormularioTarea(false)
    } catch (error) {
      console.log( error )
    }
  }

  const handleModalEditarTarea = tarea => {
    setTarea( tarea )
    setModalFormularioTarea(true)
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async () => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    try {
      const { data: {data, msg} } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
      // setProyecto({
      //   ...proyecto,
      //   tareas: proyecto.tareas.filter(tareaState => tareaState._id !== data._id)
      // })

      // Socket.io
      socket.emit('eliminar tarea', data)
      setTarea({})
      mostrarAlerta({
        msg,
        error: false
      })
      setModalEliminarTarea(false)
    } catch (error) {
      console.log( error )
    }
  }

  const submitColaborador = async email => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    try {
      // setCargando(true)
      const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
      setColaborador( data )
    } catch (error) {
      console.log( error.response )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: true
      })
    } finally {
      // setAlerta({})
      // setCargando(false)
    }
  }
  
  const agregarColaborador = async email => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    try {
      const { data: {msg} } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
      mostrarAlerta({
        msg,
        error: false
      })
      setColaborador({})
    } catch (error) {
      console.log( error.response )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: true
      })
    } finally {
      // setAlerta({})
      // setColaborador({})
    }
  }

  const handleModalEliminarColaborador = colaborador => {
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador( colaborador )
  }

  const eliminarColaborador = async () => {
    const token = localStorage.getItem('token')
    if(!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    try {
      const { data: {msg} } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)
      mostrarAlerta({
        msg,
        error: false
      })
      setProyecto({
        ...proyecto,
        colaboradores: proyecto.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
      })
      setColaborador({})
      setModalEliminarColaborador(false)
    } catch (error) {
      console.log( error.response )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: true
      })
    } finally {
      // setAlerta({})
      // setColaborador({})
    }
  }

  const completarTarea = async id => {
    const token = localStorage.getItem('token')
    if(!token) return
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }

    try {
      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
      
      // Socket.io
      socket.emit('cambiar estado', data)
    } catch (error) {
      console.log( error.response )
      const { data: {msg} } = error.response
      mostrarAlerta({
        msg,
        error: true
      })
    } finally {
      // setAlerta({})
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  // Socket.io
  const submitTareasProyecto = (tareaAgregada) => {
    setProyecto({
      ...proyecto,
      tareas: [
        ...proyecto.tareas,
        tareaAgregada
      ]
    })
  }

  const eliminarTareaProyecto = tareaEliminada => {
    setProyecto({
      ...proyecto,
      tareas: proyecto.tareas.filter(tareaState => tareaState._id !== tareaEliminada._id)
    })
  }

  const actualizarTareaProyecto = tareaActualizada => {
    setProyecto({
      ...proyecto,
      tareas: proyecto.tareas.map(tareaState => tareaState._id === tareaActualizada._id ? tareaActualizada : tareaState)
    })
  }

  const cambiarEstadoTareaProyecto = tareaCambiarEstado => {
    setProyecto({
      ...proyecto,
      tareas: proyecto.tareas.map(tareaState => tareaState._id === tareaCambiarEstado._id ? tareaCambiarEstado : tareaState)
    })
  }

  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        obtenerProyectos,
        alerta,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTask,
        tarea,
        handleModalEditarTarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        modalEliminarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTareaProyecto,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export default ProyectosContext
export {
  ProyectosProvider
}