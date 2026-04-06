package com.myblog.backend.admin.dto;

public record AdminLoginResponse(
        String token,
        String username,
        long expireSeconds
) {}
