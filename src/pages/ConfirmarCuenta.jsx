import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"
import useProyectos from "../hooks/useProyectos"

const ConfirmarCuenta = () => {

    const { alerta, mostrarAlerta } = useProyectos();
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                const { data } = await clienteAxios(`/usuarios/confirmar/${token}`);

                mostrarAlerta({ msg: data.msg, error: false })
                setCuentaConfirmada(true)
            } catch (error) {
                mostrarAlerta({ msg: error.response.data.msg, error: true })
            }
        }

        confirmarCuenta()
    }, [])

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">Confirma tu cuenta y comienza a crear tus <span className="text-slate-700">Proyectos</span></h1>

            <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
                {msg && (<Alerta />)}

                {cuentaConfirmada ? (<Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia Sesión</Link>) :
                    (<Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Volver al Inicio</Link>)}
            </div>
        </>
    )
}

export default ConfirmarCuenta