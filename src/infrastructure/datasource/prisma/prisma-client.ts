import { PrismaClient } from '../../../../generated/prisma';

export class PrismaDatasource {
  
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if ( !PrismaDatasource.instance ) {
      PrismaDatasource.instance = new PrismaClient()
    }

    return PrismaDatasource.instance
  }

}