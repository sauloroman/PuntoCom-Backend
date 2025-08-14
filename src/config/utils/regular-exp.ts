export class RegularExp {
    public static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    public static PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    public static PHONE_REGEX = /^[0-9\s\-()+]*$/
}