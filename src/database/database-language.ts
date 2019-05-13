import { DbBase } from './database';
import { TranslationKeys } from '../util/language-enum';

export interface DbLanguage extends DbBase {
    /**
     * Return the translation
     * @param key TranslationKeys
     * @param replace string[]
     * @returns final formattet string
     */
    getTranslation(key: TranslationKeys, ...replace: string[]): string;

    /**
     * Set or update the translation
     * @param key TranslationKeys
     * @param value string
     */
    setTranslation(key: TranslationKeys, value: string): void;

    /**
     * Delete the translation key
     * @param key TranslationKeys
     * @returns when translation key exist and was successful deleted
     */
    deleteTranslation(key: TranslationKeys): boolean;

    /**
     * Removing all translation wich not exist
     * @returns All removed translation keys
     */
    refreshAllTranslations(): string[];

    /**
     * Return all translationkeys wich was not set
     * @returns TranslationKeys[]
     */
    getUnsetTranslations(): TranslationKeys[];
}