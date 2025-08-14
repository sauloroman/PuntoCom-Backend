export class CodeGeneratorAdapter {

  public static generateNumericCode(length: number): string {
    if (length <= 0) return ''

    let code = '';
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10); // número entre 0 y 9
      code += digit.toString();
    }
    return code;
  }

}
