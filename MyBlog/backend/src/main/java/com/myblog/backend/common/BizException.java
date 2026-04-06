package com.myblog.backend.common;

public class BizException extends RuntimeException {

    public BizException(String message) {
        super(message);
    }
}
