package com.myblog.backend.admin.controller;

import com.myblog.backend.admin.dto.AdminProjectUpsertRequest;
import com.myblog.backend.admin.service.AdminProjectService;
import com.myblog.backend.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final AdminProjectService adminProjectService;

    public AdminProjectController(AdminProjectService adminProjectService) {
        this.adminProjectService = adminProjectService;
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@RequestBody @Valid AdminProjectUpsertRequest request) {
        Long id = adminProjectService.create(request);
        return ApiResponse.ok(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody @Valid AdminProjectUpsertRequest request) {
        adminProjectService.update(id, request);
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminProjectService.delete(id);
        return ApiResponse.ok();
    }
}
