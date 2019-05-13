import { DbMongoDB } from '../database/impl/mongodb/database-mongodb';
import { Wuffy } from '../wuffy';

interface DatabaseHandler {
    (this: Wuffy): void;
}

export const databaseHandler: DatabaseHandler = function(this: Wuffy) {
    console.log(this.config);
    switch (this.config.database.type.toLowerCase()) {
        case 'mongo':
        case 'mongodb':
            this.database = new DbMongoDB();
        break;

        default:
            console.error('Error by detecting database type');
        break;
    }

    try {
        this.database.connect(this.config.database);
        console.info('Connected to database');
    } catch (error) {
        console.error(error);
    }
};