import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";

const RutaProtegia = () => {

    const { auth, cargando } = useAuth();

    if (cargando) return <Spinner />

    return (
        <>

            {auth._id ? (
                <div className="bg-gray-200">
                    <Header />

                    <div className="md:flex md:min-h-screen">
                        <Sidebar />

                        <main className="flex-1 p-10">
                            <Outlet />
                        </main>

                    </div>
                </div>
            ) :
                <Navigate to={"/"} />
            }

        </>
    )
}

export default RutaProtegia