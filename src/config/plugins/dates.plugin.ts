import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';

export class DatesAdapter {

  private static readonly timeZone = 'America/Mexico_City';

  public static now(): Date {
    return fromZonedTime(new Date(), this.timeZone);
  }

  public static toLocal(date: Date): Date {
    return toZonedTime(date, this.timeZone);
  }

  public static formatLocal(date: Date, pattern = 'yyyy-MM-dd HH:mm:ss'): string {
    return format(this.toLocal(date), pattern, { timeZone: this.timeZone });
  }

}