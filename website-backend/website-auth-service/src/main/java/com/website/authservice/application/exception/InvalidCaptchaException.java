package com.website.authservice.application.exception;

import com.website.authservice.application.util.AuthMessages;

public class InvalidCaptchaException extends RuntimeException {

    public InvalidCaptchaException() {
        super(AuthMessages.INVALID_CAPTCHA);
    }
}