export declare enum API_RESPONSE_STATUS {
    FIELD_ERROR = "FIELD_ERROR",
    GENERAL_ERROR = "GENERAL_ERROR",
    OK = "OK",
    WRONG_CREDENTIALS_ERROR = "WRONG_CREDENTIALS_ERROR",
    RESET_PASSWORD_INVALID_TOKEN_ERROR = "RESET_PASSWORD_INVALID_TOKEN_ERROR",
    EMAIL_VERIFICATION_INVALID_TOKEN_ERROR = "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR",
    EMAIL_ALREADY_VERIFIED_ERROR = "EMAIL_ALREADY_VERIFIED_ERROR"
}
export declare enum SIGN_IN_AND_UP_STATUS {
    LOADING = "LOADING",
    READY = "READY",
    SUCCESSFUL = "SUCCESSFUL"
}
export declare enum EMAIL_PASSWORD_AUTH {
    LOADING = "LOADING",
    READY = "READY"
}
export declare enum VERIFY_EMAIL_LINK_CLICKED_STATUS {
    LOADING = "LOADING",
    INVALID = "INVALID",
    GENERAL_ERROR = "GENERAL_ERROR",
    SUCCESSFUL = "SUCCESSFUL"
}
export declare enum SEND_VERIFY_EMAIL_STATUS {
    READY = "READY",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}
export declare enum FORM_BASE_STATUS {
    IN_PROGRESS = "IN_PROGRESS",
    READY = "READY",
    LOADING = "LOADING",
    FIELD_ERRORS = "FIELD_ERRORS",
    SUCCESS = "SUCCESS",
    GENERAL_ERROR = "GENERAL_ERROR"
}
export declare enum SUCCESS_ACTION {
    SESSION_ALREADY_EXISTS = "SESSION_ALREADY_EXISTS",
    SIGN_IN_COMPLETE = "SIGN_IN_COMPLETE",
    SIGN_UP_COMPLETE = "SIGN_UP_COMPLETE",
    RESET_PASSWORD_EMAIL_SENT = "RESET_PASSWORD_EMAIL_SENT",
    PASSWORD_RESET_SUCCESSFUL = "PASSWORD_RESET_SUCCESSFUL",
    VERIFY_EMAIL_SENT = "VERIFY_EMAIL_SENT",
    EMAIL_VERIFIED_SUCCESSFUL = "EMAIL_VERIFIED_SUCCESSFUL"
}
export declare enum MANDATORY_FORM_FIELDS_ID {
    EMAIL = "email",
    PASSWORD = "password"
}
export declare enum EMAIL_VERIFICATION_MODE {
    OFF = "OFF",
    REQUIRED = "REQUIRED"
}
export declare const MANDATORY_FORM_FIELDS_ID_ARRAY: any[];
export declare const DEFAULT_RESET_PASSWORD_PATH = "/reset-password";
export declare const DEFAULT_VERIFY_EMAIL_PATH = "/verify-email";
