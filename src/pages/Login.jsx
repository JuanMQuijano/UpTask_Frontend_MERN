import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"
import useProyectos from "../hooks/useProyectos"

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { alerta, mostrarAlerta } = useProyectos()

    const { setAuth, auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth._id ? navigate("/proyectos") : navigate("/")
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes("")) {
            return mostrarAlerta({ msg: "Todos los campos son necesarios", error: true })
        }

        mostrarAlerta({})

        try {
            const { data } = await clienteAxios.post("/usuarios/login", {
                email, password
            })

            localStorage.setItem("token", data.token)

            setAuth(data)
            navigate("/proyectos")

        } catch (error) {
            mostrarAlerta({ msg: error.response.data.msg, error: true })
        }
    }


    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">Inicia Sesión y Administra tus <span className="text-slate-700">Proyectos</span></h1 >

            {msg && (<Alerta />)
            }

            <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>

                <div className="my-5">
                    <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
                    <input type="email" id="email" placeholder="Ingresa tu Email" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
                        onChange={e => setEmail(e.target.value)} value={email} />
                </div>

                <div className="my-5">
                    <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
                    <input type="password" id="password" placeholder="Ingresa tu Password" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
                        onChange={e => setPassword(e.target.value)} value={password} />
                </div>

                <input type="submit" value="Iniciar Sesión" className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors mb-5" />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link to="/registrar" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Aún no tienes cuenta? Registrate</Link>
                <Link to="/olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé Mi Password</Link>
            </nav>

        </>
    )
}

export default Login