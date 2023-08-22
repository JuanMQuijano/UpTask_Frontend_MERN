import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/Login"
import Registrar from "./pages/Registrar"
import OlvidePassword from "./pages/OlvidePassword"
import NuevoPassword from "./pages/NuevoPassword"
import ConfirmarCuenta from "./pages/ConfirmarCuenta"
import { AuthProvider } from "./context/AuthProvider"
import Proyectos from "./pages/Proyectos"
import RutaProtegia from "./layouts/RutaProtegia"
import NuevoProyecto from "./pages/NuevoProyecto"
import { ProyectoProvider } from "./context/ProyectoProvider"
import Proyecto from "./pages/Proyecto"
import EditarProyecto from "./pages/EditarProyecto"
import NuevoColaborador from "./pages/NuevoColaborador"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectoProvider>
          <Routes>

            {/* Área Pública */}
            <Route path="/" element={<AuthLayout />}>
              {/* Index hace referencia al elemento que se mostrará al entrar al path inicial en este caso / */}
              <Route index element={<Login />} />
              <Route path="registrar" element={<Registrar />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              {/* con /:X declaramos un path dinamico */}
              <Route path="olvide-password/:token" element={<NuevoPassword />} />
              <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
            </Route>

            <Route path="/proyectos" element={<RutaProtegia />}>
              <Route index element={<Proyectos />} />
              <Route path="crear-proyecto" element={<NuevoProyecto />} />
              <Route path=":id" element={<Proyecto />} />
              <Route path="editar/:id" element={<EditarProyecto />} />
              <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />
            </Route>

          </Routes>
        </ProyectoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
