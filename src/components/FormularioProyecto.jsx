import { useEffect, useState } from "react"
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";
import { useParams } from "react-router-dom";

const FormularioProyecto = () => {

    const params = useParams();
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    const [id, setId] = useState(params.id ? proyecto._id : null)
    const [nombre, setNombre] = useState(params.id ? proyecto.nombre : "");
    const [descripcion, setDescripcion] = useState(params.id ? proyecto.descripcion : "");
    const [fechaEntrega, setFechaEntrega] = useState(params.id ? proyecto.fechaEntrega?.split("T")[0] : "");
    const [cliente, setCliente] = useState(params.id ? proyecto.cliente : "");

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
            return mostrarAlerta({ msg: "Todos los campos son obligatorios", error: true })
        }

        await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente })

        setId(null)
        setNombre("")
        setDescripcion("")
        setFechaEntrega("")
        setCliente("")
    }

    const { msg } = alerta;

    return (
        <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow-sm" onSubmit={handleSubmit}>
            {msg && <Alerta />}


            <div className="mb-5">
                <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm">Nombre Proyecto</label>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Nombre Proyecto"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm">Descripción</label>
                <textarea name="descripcion" id="descripcion" placeholder="Descripción del Proyecto"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}></textarea>

            </div>

            <div className="mb-5">
                <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm">Fecha Entrega</label>
                <input
                    type="date"
                    name="fechaEntrega"
                    id="fechaEntrega"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm">Nombre Cliente</label>
                <input
                    type="text"
                    name="cliente"
                    id="cliente"
                    placeholder="Nombre del Cliente"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                />
            </div>

            <input type="submit" value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'} className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors" />
        </form>
    )
}

export default FormularioProyecto