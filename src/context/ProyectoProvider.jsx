import { useEffect, useState, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"
import useAuth from "../hooks/useAuth";

let socket;

const ProyectoContext = createContext();

const ProyectoProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            setCargando(true)
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const { data } = await clienteAxios("/proyectos", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })

                setProyectos(data);
            } catch (error) {
                console.log(error);
            } finally {
                setCargando(false)
            }
        }

        obtenerProyectos();
    }, [auth]);

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => { setAlerta({}) }, 3000)
    }

    const submitProyecto = async (proyecto) => {
        if (proyecto?.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const proyectosActualizados = proyectos.map(proyecto => proyecto._id === data._id ? data : proyecto);

            setProyectos(proyectosActualizados);

            setAlerta({ msg: "Proyecto Actualizado Correctamente", error: false })

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000)
        } catch (error) {
            console.log(error);
        }
    }

    const nuevoProyecto = async proyecto => {
        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.post("/proyectos", proyecto, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(data);

            setAlerta({ msg: "Proyecto Creado Correctamente", error: false })
            setProyectos([...proyectos, data]);

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000)
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)

        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios(`/proyectos/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate("/proyectos")
            setAlerta({ msg: error.response.data.msg, error: true })

            setTimeout(() => { setAlerta({}) }, 3000)
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {

        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            //Actualizar State 
            const proyectosActualizado = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setProyecto({})

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000)

        } catch (error) {
            console.log(error);
        }
    }

    const handleModalFormularioTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async (datos) => {
        if (datos?.id) {
            await editarTarea(datos)
        } else {
            await nuevaTarea(datos)
        }
    }

    const nuevaTarea = async (datos) => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const { data } = await clienteAxios.post(`/tareas`, datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            mostrarAlerta({ msg: "Tarea Agregada al Proyecto", error: false })

            setTimeout(() => {
                setAlerta({})
                setModalFormularioTarea(false)
            }, 3000);

            //SOCKET IO
            socket.emit("nueva tarea", data)

        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async (datos) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.put(`/tareas/${datos.id}`, datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            mostrarAlerta({ msg: data.msg, error: false })

            setAlerta({})
            setModalFormularioTarea(false)
            setTarea({})

            socket.emit("actualizar tarea", data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminar = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async (datos) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.delete(`/tareas/${datos._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({ msg: data.msg, error: false })

            setTarea({})
            setModalEliminarTarea(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000)

            socket.emit("eliminar tarea", datos)

        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, { email }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({})

            setColaborador(data)

        } catch (error) {
            setAlerta({ msg: error.response.data.msg, error: true });
            setColaborador({})
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({ msg: data.msg, error: false })
            setColaborador({})

            setTimeout(() => { setAlerta({}) }, 3000)


        } catch (error) {
            setAlerta({ msg: error.response.data.msg, error: true });
        } finally {
            setCargando(false)
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)

        setColaborador(colaborador)
    }

    const eliminarColaborador = async (colaborador) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaboradores/${proyecto._id}`, { id: colaborador._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAlerta({ msg: data.msg, error: false })

            const proyectoActualizado = { ...proyecto, }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradoresState => colaboradoresState._id !== colaborador._id);

            //Actualizamos el state
            setProyecto(proyectoActualizado)
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.log(error);
        }
    }

    const handleCompletarTarea = async id => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setTarea({})
            setAlerta({})

            socket.emit("cambiar estado", data);

        } catch (error) {
            console.log(error);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SOCKET IO
    const submitTareasProyecto = (tareaNueva) => {
        //Agrega la tarea al State

        //Extraer del state el proyectoActual y lo guardamos en una variable
        const proyectoActualizado = { ...proyecto }
        //Sobreescribimios el valor de .tareas, con la copia de las tareas de antes con la nueva tarea
        proyectoActualizado.tareas = [...proyecto.tareas, tareaNueva]

        //Actualizamos el state
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        //Agrega la tarea al State

        //Extraer del state el proyectoActual y lo guardamos en una variable
        const proyectoActualizado = { ...proyecto, }
        //Sobreescribimios el valor de .tareas, con la copia de las tareas de antes con la nueva tarea
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);

        //Actualizamos el state
        setProyecto(proyectoActualizado)
    }

    const editarTareaProyecto = tarea => {
        //Agrega la tarea al State

        //Extraer del state el proyectoActual y lo guardamos en una variable
        const proyectoActualizado = { ...proyecto, }
        //Sobreescribimios el valor de .tareas, con la copia de las tareas de antes con la nueva tarea
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);

        //Actualizamos el state
        setProyecto(proyectoActualizado)
    }

    const cambiarEstado = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);

        setProyecto(proyectoActualizado);
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }


    return (
        <ProyectoContext.Provider value={
            {
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminar,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                handleCompletarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                cambiarEstado,
                cerrarSesionProyectos
            }}>
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectoProvider
}

export default ProyectoContext