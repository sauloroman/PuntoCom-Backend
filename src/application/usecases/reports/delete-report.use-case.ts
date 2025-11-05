import path from "path";
import { promises as fs } from "fs";

export class DeleteReportUseCase {

  public readonly uploadsDir = path.join(__dirname, '../../../uploads/reports');

  public async execute(entity: string, reportId: string): Promise<boolean> {
    console.log({entity, reportId})
    try {
      const filePath = path.join(this.uploadsDir, entity, reportId + ".pdf");
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
