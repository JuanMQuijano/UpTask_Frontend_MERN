import { useEffect } from "react";
import PreviewProyecto from "../components/PreviewProyecto";
import Spinner from "../components/Spinner";
import useProyectos from "../hooks/useProyectos"
import Alerta from "../components/Alerta";
import io from "socket.io-client"

let socket;

const Proyectos = () => {

    const { proyectos, cargando, alerta } = useProyectos()

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)

        socket.emit("prueba", "Juan")

        socket.on("respuesta", (persona) => {
            console.log("Respuesta recibida en frontend", persona);
        })
    }, [])

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-4xl font-black">Proyectos</h1>

            {msg && <Alerta />}

            <div className="bg-white shadow mt-10 rounded-lg">
                {cargando ? <Spinner /> : (
                    proyectos.length ?
                        proyectos.map(proyecto => (
                            <PreviewProyecto
                                key={proyecto._id}
                                proyecto={proyecto} />)
                        )
                        : <p className=" p-5 text-center text-gray-600 uppercase">No hay proyectos</p>)}
            </div>
        </>
    )
}

export default Proyectos