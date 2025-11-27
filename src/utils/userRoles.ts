import { UserRoles } from '@/types';

export const getRoleDisplayName = (role: UserRoles): string => {
  const roleNames: Record<UserRoles, string> = {
    [UserRoles.superAdmin]: 'Super Admin',
    [UserRoles.admin]: 'Admin',
    [UserRoles.editor]: 'Editor', 
    [UserRoles.viewer]: 'Viewer',
    [UserRoles.user]: 'User',
    [UserRoles.staff]: 'Staff',
  };
  
  return roleNames[role] || role;
};

export const getRoleColor = (role: UserRoles): string => {
  const roleColors: Record<UserRoles, string> = {
    [UserRoles.superAdmin]: 'bg-red-100 text-red-800',
    [UserRoles.admin]: 'bg-purple-100 text-purple-800',
    [UserRoles.editor]: 'bg-blue-100 text-blue-800',
    [UserRoles.viewer]: 'bg-green-100 text-green-800',
    [UserRoles.user]: 'bg-gray-100 text-gray-800',
    [UserRoles.staff]: 'bg-yellow-100 text-yellow-800',
  };
  
  return roleColors[role] || 'bg-gray-100 text-gray-800';
};

export const canUserManageRole = (currentUserRole: UserRoles, targetRole: UserRoles): boolean => {
  // SuperAdmin can manage all roles
  if (currentUserRole === UserRoles.superAdmin) {
    return true;
  }
  
  // Admin can only manage viewer/staff roles
  if (currentUserRole === UserRoles.admin) {
    return targetRole === UserRoles.viewer || targetRole === UserRoles.staff;
  }
  
  return false;
};

export const getAvailableRolesForUser = (currentUserRole: UserRoles): UserRoles[] => {
  if (currentUserRole === UserRoles.superAdmin) {
    return [UserRoles.admin, UserRoles.editor, UserRoles.viewer];
  }
  
  if (currentUserRole === UserRoles.admin) {
    return [UserRoles.viewer]; // Admin creates staff, which is viewer role
  }
  
  return [];
};