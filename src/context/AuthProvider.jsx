import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    useEffect(() => {

        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                setCargando(false)
                return
            }

            try {
                const { data } = await clienteAxios("/usuarios/perfil", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                })

                setAuth(data)

            } catch (error) {
                setAuth({})
            } finally {
                setCargando(false)
            }
        }


        autenticarUsuario()

    }, []);

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            cargando,
            cerrarSesionAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }

export default AuthContext