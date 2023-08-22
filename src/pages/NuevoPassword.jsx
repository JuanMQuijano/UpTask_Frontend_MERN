import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";
import useProyectos from "../hooks/useProyectos";

const NuevoPassword = () => {

  const params = useParams();
  const { token } = params;


  const {alerta, mostrarAlerta} = useProyectos()
  const [tokenValido, setTokenValido] = useState(false);
  const [password, setPassword] = useState("")
  const [passwordModificado, setPasswordModificado] = useState(false)

  useEffect(() => {
    const validarTokenPassword = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)

        setTokenValido(true)
      } catch (error) {
        mostrarAlerta({ msg: error.response.data.msg, error: true })
      }
    };
    validarTokenPassword()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "") {
      return mostrarAlerta({ msg: "El password no debe estar vacío", error: true })
    }

    if (password.length < 6) {
      return mostrarAlerta({ msg: "El password debe tener minimo 6 caracteres", error: true })
    }

    mostrarAlerta({})

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, { password });

      mostrarAlerta({ msg: data.msg, error: false })
      setPassword("")
      setPasswordModificado(true)
    } catch (error) {
      mostrarAlerta({ msg: error.response.data.msg, error: true });
    }
  }


  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Reestablece tu Password y no pierdas acceso a tus <span className="text-slate-700">Proyectos</span></h1>

      {msg && (<Alerta />)}

      {tokenValido && (
        <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>

          <div className="my-5">
            <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
            <input type="password" id="password" placeholder="Escribte tu Nuevo Password" className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
              onChange={e => { setPassword(e.target.value) }} value={password} />
          </div>

          <input type="submit" value="Guardar Nuevo Password" className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors mb-5" />
        </form>
      )}

      {passwordModificado && (<Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia Sesión</Link>)}


    </>
  )
}

export default NuevoPassword