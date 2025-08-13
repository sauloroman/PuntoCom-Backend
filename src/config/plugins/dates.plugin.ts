import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';

export class DatesAdapter {

  private static readonly timeZone = 'America/Mexico_City';

  public static now(): Date {
    return fromZonedTime(new Date(), this.timeZone);
  }

  public static toLocal(date: Date): Date {
    return toZonedTime(date, this.timeZone);
  }

}