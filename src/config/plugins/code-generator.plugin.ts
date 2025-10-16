import { ProductCode, SaleCode } from "../../domain/value-objects";

export class CodeGeneratorAdapter {

  public static generateNumericCode(length: number): string {
    if (length <= 0) return '';

    let code = '';
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10); // número entre 0 y 9
      code += digit.toString();
    }
    return code;
  }

  public static generateAlphanumericCode(length: number): string {
    if (length <= 0) return '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      code += characters[index];
    }

    return code;
  }

  public static generateProductCode(): ProductCode {
    const productCodeLength = ProductCode['MAX_QUANTITY_CHARACTERS'];

    let numericCode = this.generateNumericCode(productCodeLength);

    if (numericCode.startsWith('0')) {
      numericCode = (Math.floor(Math.random() * 9) + 1).toString() + numericCode.slice(1);
    }

    const productCode = new ProductCode(numericCode);
    return productCode;
  }

  public static generateSaleCode(): SaleCode {
    const saleCodeLength = SaleCode['MAX_QUANTITY_CHARACTERS'];

    const alphanumericCode = this.generateAlphanumericCode(saleCodeLength);
    const saleCode = new SaleCode(alphanumericCode);

    return saleCode;
  }

}
