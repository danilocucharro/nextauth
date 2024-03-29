import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validadeUserPermissions } from "../utils/validateUserPermissions";

type UseCanParams = {
    permissions?: string[];
    roles?: string[]; 
};

export function useCan({ permissions, roles }: UseCanParams){
    const { user, isAuthenticated } = useContext(AuthContext)//importando os dados do usuario la no authContext

    if (!isAuthenticated) {
        return false;
    }

    const userHasValidPermissions = validadeUserPermissions({
        user,
        permissions,
        roles
    })

    return userHasValidPermissions;
}