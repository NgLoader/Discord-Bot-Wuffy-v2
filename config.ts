export interface Config {
    token: string;
    prefix: string;
    database: ConfigDatabase;
}

export interface ConfigDatabase {
    type: string;
    prefix: string;
    settings: any;
}

export interface ConfigDatabaseMongoDB extends ConfigDatabase {
    usingURL: boolean;
    url: string;
    username: string;
    password: string;
    database: string;
    address: string;
    port: string;
}

export const config: Config = {
    token: 'BOT TOKEN',
    prefix: '!',
    database: {
        type: 'mongodb',
        prefix: 'beta_',
        settings: {
            usingURL: false,
            url: 'mongodb://myDBReader:D1fficultP%40ssw0rd@mongos0.example.com:27017,mongos1.example.com:27017,mongos2.example.com:27017/admin',
            username: 'myDBReader',
            password: 'D1fficultP%40ssw0rd',
            database: 'admin',
            address: 'localhost',
            port: 27017
        }
    }
};