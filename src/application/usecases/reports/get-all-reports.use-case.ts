import fs from 'fs';
import path from 'path';
import { DatesAdapter } from '../../../config/plugins';

export class GetAllReportsUseCase {

    constructor(){}

    public async execute() {
        const basePath = path.resolve(__dirname, '../../../uploads/reports');

        const entities = ['users', 'suppliers', 'products', 'inventoryAdjustments'];

        const results: Record<string, { id: string; date: string }[]> = {};

        for (const entity of entities) {
            const entityPath = path.join(basePath, entity);

            if (!fs.existsSync(entityPath)) {
                results[entity] = [];
                continue;
            }

            const files = fs.readdirSync(entityPath);

            const parsedFiles = files
                .filter(file => file.endsWith('.pdf'))
                .map(file => {
                    const filePath = path.join(entityPath, file);
                    const stats = fs.statSync(filePath);
                    return {
                        id: path.basename(file, path.extname(file)),
                        date: DatesAdapter.formatLocal( DatesAdapter.toLocal(stats.birthtime) )
                    };
                });

            results[entity] = parsedFiles;
        }

        return results;
    }

}