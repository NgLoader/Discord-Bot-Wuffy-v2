export enum LanguageEnum {
    GERMAN = 0,
    ENGLISH = 1
}

export enum TranslationKeys {
    UNKNOWN =                                                           'unknown',
    RANK_0 =                                                            'rank_0',
    COMMAND_PING =                                                      'command_ping',
    COMMAND_PING_RESPONSE =                                             'command_ping_response',
    COMMAND_LANGUAGE_SYNTAX =                                           'command_language_syntax'
}

export const TranslationKeysArray: Array<string> = Object.keys(TranslationKeys).filter(value => typeof value !== 'number');