import { 
  SendChangePasswordI, 
  SendDeactivationAccountI, 
  SendEmailI, 
  SendForgotPasswordI, 
  SendVerificationCodeI 
} from "../../infrastructure/interfaces/email.interface";

export abstract class EmailService {  
  abstract sendEmail( sendEmail: SendEmailI ): Promise<boolean>
  abstract sendValidateAccountEmail( data: SendVerificationCodeI ): Promise<void>
  abstract sendDeactivationAccountEmail( data: SendDeactivationAccountI ): Promise<void>
  abstract sendForgotPasswordEmail( data: SendForgotPasswordI ): Promise<void>
  abstract sendChangePasswordEmail( data: SendChangePasswordI ): Promise<void>
}