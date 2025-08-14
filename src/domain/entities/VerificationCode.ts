import { VerificationCodeValue } from '../value-objects/VerificationCodeValue';
import { DomainError } from '../errors/domain.error';

interface VerificationCodeProps {
  id: string;
  userId: string;
  code: VerificationCodeValue;
  expiresAt: Date;
  createdAt: Date;
}

export class VerificationCode {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _code: VerificationCodeValue;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;

  private readonly MESSAGE_ERROR = 'VERIFICATION_CODE_ENTITY_ERROR';

  constructor({
    id,
    userId,
    code,
    expiresAt,
    createdAt,
  }: VerificationCodeProps) {
    this._id = id;
    this._userId = userId;
    this._code = code;
    this._expiresAt = expiresAt;
    this._createdAt = createdAt;

    this.validate();
  }

  private validate() {
    if (!this._userId || this._userId.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El ID de usuario es obligatorio');
    }
    if (this._expiresAt <= new Date()) {
      throw new DomainError(this.MESSAGE_ERROR, 'La fecha de expiración debe ser futura');
    }
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get code(): VerificationCodeValue {
    return this._code;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }
}
