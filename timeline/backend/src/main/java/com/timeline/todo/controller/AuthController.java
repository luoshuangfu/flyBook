package com.timeline.todo.controller;

import com.timeline.todo.model.User;
import com.timeline.todo.repo.UserRepository;
import com.timeline.todo.service.PasswordService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository userRepository;
  private final PasswordService passwordService;

  public AuthController(UserRepository userRepository, PasswordService passwordService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, String> register(@RequestBody RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new IllegalArgumentException("邮箱已被注册");
    }
    User user = new User();
    user.setEmail(request.email());
    user.setDisplayName(request.displayName());
    user.setPasswordHash(passwordService.hash(request.password()));
    User saved = userRepository.save(user);
    return Map.of(
      "userId", saved.getId().toString(),
      "token", UUID.randomUUID().toString()
    );
  }

  @PostMapping("/login")
  public Map<String, String> login(@RequestBody LoginRequest request) {
    User user = userRepository.findByEmail(request.email())
      .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
    if (!passwordService.matches(request.password(), user.getPasswordHash())) {
      throw new IllegalArgumentException("密码错误");
    }
    return Map.of(
      "userId", user.getId().toString(),
      "token", UUID.randomUUID().toString()
    );
  }

  public record RegisterRequest(
    @Email @NotBlank String email,
    @NotBlank String password,
    String displayName
  ) {}

  public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
}
