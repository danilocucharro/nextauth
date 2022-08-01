type User = {
    permissions: string[];
    roles: string[];
};

type ValidadeUserPermissionsParams = {
    user: User;
    permissions?: string[];
    roles?: string[]; 
}

export function validadeUserPermissions({
    user,
    permissions,
    roles,
}: ValidadeUserPermissionsParams) {
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
}