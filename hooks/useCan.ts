import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

type UseCanParams = {
    permissions?: string[];
    roles?: string[]; 
};

export function useCan({ permissions, roles }: UseCanParams){
    const { user, isAuthenticated } = useContext(AuthContext)//importando os dados do usuario la no authContext

    if (!isAuthenticated) {
        return false;
    }

    if (permissions?.length > 0) {
        const hasAllPermissions = permissions.every(permission => {// retornar true caso todas as permissions existirem
            return user.permissions.includes(permission);
        });

        if (!hasAllPermissions) {
            return false;
        }

        
    }

    if (roles?.length > 0) {
        const hasAllRoles = roles.some(role => {// retornar true caso todas as roles existirem
            return user.roles.includes(role);
        });

        if (!hasAllRoles) {
            return false;
        }
    }

    return true;
}