import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useProyectos from "../hooks/useProyectos";

const OlvidePassword = () => {

    const [email, setEmail] = useState("");
    const {alerta, mostrarAlerta} = useProyectos()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || email.length < 6) {
            return mostrarAlerta({ msg: "El Email es obligatorio", error: true })
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email });

            mostrarAlerta({ msg: data.msg, error: false })
        } catch (error) {
            console.log(error.response);
            mostrarAlerta({ msg: error.response.data.msg, error: true })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">¿Olvidaste tu <span className="text-slate-700">Password?</span> Recupera tu <span className="text-slate-700">acceso</span></h1>

            {msg && (<Alerta />)}

            <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>

                <div className="my-5">
                    <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
                    <input type="email" id="email" placeholder="Ingresa tu Email" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
                        onChange={e => { setEmail(e.target.value) }} value={email} />
                </div>


                <input type="submit" value="Recuperar" className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors mb-5" />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes cuenta? Inicia Sesión</Link>
                <Link to="/registrar" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Aún no tienes Cuenta? Registrate</Link>
            </nav>
        </>
    )
}

export default OlvidePassword