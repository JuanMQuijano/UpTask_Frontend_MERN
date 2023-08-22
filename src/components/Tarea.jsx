import { formatearFecha } from "../helpers/formatearFecha";
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {

    const { handleModalEditarTarea, handleModalEliminar, handleCompletarTarea } = useProyectos();
    const admin = useAdmin();

    const { descripcion, nombre, prioridad, _id, estado } = tarea;

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className='mb-1 text-xl'>{nombre}</p>
                <p className='mb-1 text-sm text-gray-500 uppercase'>{descripcion}</p>
                <p className='mb-1 text-sm'>{formatearFecha(tarea?.fechaEntrega)}</p>
                <p className='mb-1 text-gray-600'>Prioridad: {prioridad}</p>
                {estado.length > 0 && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completado por: {tarea.completado.nombre}</p>}
            </div>

            <div className='flex flex-col lg:flex-row gap-2'>
                {admin && (
                    <button className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => { handleModalEditarTarea(tarea) }}>Editar</button>
                )}


                <button className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`} onClick={() => { handleCompletarTarea(_id) }}>{estado ? 'Completa' : 'Incompleta'}</button>


                {admin && (<button className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg' onClick={() => { handleModalEliminar(tarea) }}>Eliminar</button>)}


            </div>
        </div>
    )
}

export default Tarea


