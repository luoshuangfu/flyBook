package com.myblog.backend.admin.service;

import com.myblog.backend.admin.dto.AdminLoginRequest;
import com.myblog.backend.admin.dto.AdminLoginResponse;
import com.myblog.backend.admin.entity.AdminUser;
import com.myblog.backend.admin.repo.AdminUserRepository;
import com.myblog.backend.common.BizException;
import com.myblog.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final long expireSeconds;

    public AdminAuthService(AdminUserRepository adminUserRepository,
                            PasswordEncoder passwordEncoder,
                            JwtService jwtService,
                            @Value("${myblog.jwt.expire-seconds:86400}") long expireSeconds) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.expireSeconds = expireSeconds;
    }

    public AdminLoginResponse login(AdminLoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new BizException("用户名或密码错误"));
        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new BizException("账号已禁用");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BizException("用户名或密码错误");
        }
        String token = jwtService.generateToken(user.getUsername());
        return new AdminLoginResponse(token, user.getUsername(), expireSeconds);
    }
}
