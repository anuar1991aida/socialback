// create-report.dto.ts
export class CreateReportDto {
  moods?: string[];
  page?: number;
  limit?: number;
  sphere_id?: number;
  start_date?: string;
  end_date?: string;
  tip_social?: string[];
}