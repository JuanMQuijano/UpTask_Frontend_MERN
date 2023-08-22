import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom"
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import useAdmin from "../hooks/useAdmin";
import io from "socket.io-client"

let socket;

const Proyecto = () => {

    const params = useParams();
    const { id } = params;

    const { obtenerProyecto, proyecto, cargando, handleModalFormularioTarea, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, cambiarEstado } = useProyectos();
    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(id);
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
        socket.emit("abrir proyecto", params.id);
    }, [])

    useEffect(() => {
        socket.on("tarea agregada", (tareaNueva) => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on("tarea eliminada", (tareaEliminada) => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on("tarea actualizada", (tareaActualizada) => {
            if (tareaActualizada.proyecto._id === proyecto._id) {
                editarTareaProyecto(tareaActualizada)
            }
        })

        socket.on("nuevo estado", (tarea) => {
            if (tarea.proyecto._id === proyecto._id) {
                cambiarEstado(tarea)
            }
        })
    })

    const { nombre } = proyecto;

    return (

        cargando ? <Spinner /> :
            <>
                <div className="flex justify-between">
                    <h1 className="font-black text-4xl">{nombre}</h1>

                    {admin && (
                        <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>

                            <Link to={`/proyectos/editar/${id}`} className="uppercase font-bold">Editar</Link>
                        </div>
                    )}

                </div>

                {admin && (<button type="button" className="flex gap-2 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-2" onClick={handleModalFormularioTarea}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    Nueva Tarea</button>)
                }


                <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

                <div className="bg-white shadow mt-10 rounded-lg">
                    {cargando ? <Spinner /> : proyecto.tareas?.length ?
                        proyecto.tareas?.map((tarea, index) => (
                            <Tarea key={index} tarea={tarea} />
                        )) :
                        <p className="text-center my-4 p-10">No Hay Tareas en este Proyecto</p>}

                </div>

                {admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-bold text-xl">Colaboradores del Proyecto</p>

                            <Link to={`/proyectos/nuevo-colaborador/${id}`} className="text-gray-400 uppercase font-bold hover:text-black">Añadir Colaborador</Link>
                        </div>

                        <div className="bg-white shadow mt-10 rounded-lg">
                            {cargando ? <Spinner /> : proyecto.colaboradores?.length ?
                                proyecto.colaboradores?.map((colaborador, index) => (
                                    <Colaborador key={index} colaborador={colaborador} />
                                )) :
                                <p className="text-center my-4 p-10">No Hay Colaboradores en este Proyecto</p>}

                        </div>
                    </>)
                }


                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
    )
}

export default Proyecto