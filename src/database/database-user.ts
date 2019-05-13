import { WuffyRoleEnum } from '../util/role-enum';
import { DbBase } from './database';
import { LanguageEnum } from '../util/language-enum';

export interface DbUser extends DbBase {
    /**
     * Return user locale as string
     * @param userId GuildId
     * @returns User locale as string
     */
    getLocale(): LanguageEnum;

    /**
     * Set the user locale
     * @param userId GuildId
     * @param locale User locale as string
     */
    setLocale(locale: LanguageEnum): void;

    /**
     * Return currently highest role
     * @returns WuffyRole
     */
    getRoles(): WuffyRoleEnum[];

    /**
     * Check if user has currently role
     * @param role WuffyRole
     */
    hasRole(...roles: WuffyRoleEnum[]): boolean;

    /**
     * Add a role to a user
     * @param role WuffyRole
     * @param expire number in millis
     */
    addRole(...roles: WuffyRoleEnum[]): void;

    /**
     * Remove a given role by id
     * @param id number from role
     */
    removeRole(...roles: WuffyRoleEnum[]): void;

    /**
     * Set all roles
     * @param roles [ { id: number, role: WuffyRole, expire: number } ]
     */
    setRole(...roles: WuffyRoleEnum[]): void;
}