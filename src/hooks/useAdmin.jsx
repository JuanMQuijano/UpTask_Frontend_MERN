import useProyectos from "./useProyectos";
import useAuth from "./useAuth";

const useAdmin = () => {
    const { proyecto } = useProyectos();
    const { auth } = useAuth();

    //Si el creador del proyecto es la persona que está logeada
    return proyecto.creador === auth._id
}

export default useAdmin