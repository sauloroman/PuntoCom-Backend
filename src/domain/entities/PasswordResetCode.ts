import { DomainError } from "../errors/domain.error";
import { CodeValue } from "../value-objects";

interface PasswordResetCodeProps {
    resetId?: string,
    code: CodeValue,
    expiresAt: Date,
    createdAt: Date, 
    userId: string   
}

export class PasswordResetCode {

    private readonly _resetId: string;
    private readonly _code: CodeValue;
    private readonly _expiresAt: Date;
    private readonly _createdAt: Date;
    private readonly _userId: string;

    private readonly MESSAGE_ERROR = 'PASSWORD_RESET_CODE_ENTITY_ERROR'

    constructor({
        resetId = '',
        code,
        expiresAt,
        createdAt,
        userId
    }: PasswordResetCodeProps){
        this._resetId = resetId
        this._code = code
        this._expiresAt = expiresAt
        this._createdAt = createdAt
        this._userId = userId
        
        this.validate()
    }

    private validate() {
        if ( !this._userId || this._userId.trim().length === 0 ) {
            throw new DomainError(this.MESSAGE_ERROR, 'El ID de usuario es obligatorio')
        }
    }

    get id(): string {
        return this._resetId
    }

    get userId(): string {
        return this._userId
    }

    get code(): CodeValue {
        return this._code
    }

    get expiresAt(): Date {
        return this._expiresAt
    }

    get createdAt(): Date {
        return this._createdAt
    }

    public isExpired(): boolean {
        return new Date() > this._expiresAt
    }

}