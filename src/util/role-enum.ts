class WuffyRole {
    id: WuffyRoleEnum;
    name: string;
    size: number;
}

export enum WuffyRoleEnum {
    Admin =         0,
    Moderator =     1,
    Supporter =     2,
    Donator =       3,
    User =          4
}

export const WuffyRoles: WuffyRole[] = [
    { id: WuffyRoleEnum.Admin,      name: 'Admin',      size: 4 },
    { id: WuffyRoleEnum.Moderator,  name: 'Moderator',  size: 3 },
    { id: WuffyRoleEnum.Supporter,  name: 'Supporter',  size: 2 },
    { id: WuffyRoleEnum.Donator,    name: 'Donator',    size: 1 },
    { id: WuffyRoleEnum.User,       name: 'User',       size: 0 }
];

export function getWuffyRole(role: WuffyRoleEnum): WuffyRole {
    return WuffyRoles.find(index => index.id === role);
}