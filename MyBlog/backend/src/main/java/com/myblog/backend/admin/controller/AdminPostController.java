package com.myblog.backend.admin.controller;

import com.myblog.backend.admin.dto.AdminPostUpsertRequest;
import com.myblog.backend.admin.service.AdminPostService;
import com.myblog.backend.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final AdminPostService adminPostService;

    public AdminPostController(AdminPostService adminPostService) {
        this.adminPostService = adminPostService;
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@RequestBody @Valid AdminPostUpsertRequest request) {
        Long id = adminPostService.create(request);
        return ApiResponse.ok(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody @Valid AdminPostUpsertRequest request) {
        adminPostService.update(id, request);
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminPostService.delete(id);
        return ApiResponse.ok();
    }
}
