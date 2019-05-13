export enum UserPermissions {
    UNKNOWN = 0,
    COMMAND_KICK = 9,
    COMMAND_PING = 8,
    COMMAND_PLAY = 3,
    COMMAND_PREFIX = 4,
    COMMAND_LANGUAGE = 5
}

export enum PermissionCategory {
    CHANNEL = 'channel',
    GLOBAL = 'global'
}

export enum PermissionType {
    RANK = 'rank',
    USER = 'user'
}

export const PermissionCategoryValues: string[] = Object.values(PermissionCategory).filter(value => typeof value !== 'number');
export const PermissionTypeValues: string[] = Object.values(PermissionType).filter(value => typeof value !== 'number');

export const UserPermissionKeys: string[] = Object.values(UserPermissions).filter(value => typeof value !== 'number');
export const UserPermissionValues: number[] = Object.values(UserPermissions).filter(value => typeof value === 'number');