import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";

const Registrar = () => {

  const { auth } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const { alerta, mostrarAlerta } = useProyectos()

  useEffect(() => {
    auth._id ?? navigate("/proyectos")
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, email, password, passwordConfirm].includes("")) {
      return mostrarAlerta({ error: true, msg: "Todos los campos son Obligatorios" })
    }

    if (password !== passwordConfirm) {
      return mostrarAlerta({ error: true, msg: "Los Passwords no coinciden" })
    }

    if (password.length < 6) {
      return mostrarAlerta({ error: true, msg: "El Password debe tener minimo 6 caracteres" })
    }

    mostrarAlerta({ error: false, msg: "" })

    //Crear usuario en la API
    try {
      const { data } = await clienteAxios.post(`/usuarios`, { nombre, password, email })

      mostrarAlerta({ error: false, msg: data.msg })

      setNombre("")
      setEmail("")
      setPassword("")
      setPasswordConfirm("")

    } catch (error) {
      mostrarAlerta({ error: true, msg: error.response.data.msg })
    }
  }

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Registrate y Administra tus <span className="text-slate-700">Proyectos</span></h1>

      {msg && (<Alerta />)}

      <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>

        <div className="my-5">
          <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
          <input type="text" id="nombre" placeholder="Ingresa tu Nombre" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
            onChange={e => setNombre(e.target.value)} value={nombre} />
        </div>

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

        <div className="my-5">
          <label htmlFor="password_confirm" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
          <input type="password" id="password_confirm" placeholder="Repite tu Password" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
            onChange={e => setPasswordConfirm(e.target.value)} value={passwordConfirm} />
        </div>

        <input type="submit" value="Registrar" className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors mb-5" />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes cuenta? Inicia Sesión</Link>
        <Link to="/olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé Mi Password</Link>
      </nav>
    </>
  )
}

export default Registrar