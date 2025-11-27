import { useMemo } from "react";
import { UserRoles } from "@/types";

interface UseUserPermissionsProps {
  currentUserRole: UserRoles;
}

export const useUserPermissions = ({
  currentUserRole,
}: UseUserPermissionsProps) => {
  const permissions = useMemo(() => {
    const canCreateUsers = [UserRoles.superAdmin, UserRoles.admin].includes(
      currentUserRole
    );
    const canEditUsers = [UserRoles.superAdmin, UserRoles.admin].includes(
      currentUserRole
    );
    const canDeleteUsers = currentUserRole === UserRoles.superAdmin;

    const availableRolesToAssign = (() => {
      if (currentUserRole === UserRoles.superAdmin) {
        return [UserRoles.admin, UserRoles.staff];
      }
      if (currentUserRole === UserRoles.admin) {
        return [UserRoles.staff]; // Admin can only create staff (viewer)
      }
      return [];
    })();

    return {
      canCreateUsers,
      canEditUsers,
      canDeleteUsers,
      availableRolesToAssign,
      isAdmin: currentUserRole === UserRoles.admin,
      isSuperAdmin: currentUserRole === UserRoles.superAdmin,
    };
  }, [currentUserRole]);

  return permissions;
};
