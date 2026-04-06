package com.myblog.backend.post.controller;

import com.myblog.backend.common.ApiResponse;
import com.myblog.backend.post.dto.LabelValueResponse;
import com.myblog.backend.post.dto.PostDetailResponse;
import com.myblog.backend.post.dto.PostListItemResponse;
import com.myblog.backend.post.service.PostQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    private final PostQueryService postQueryService;

    public PostController(PostQueryService postQueryService) {
        this.postQueryService = postQueryService;
    }

    @GetMapping("/posts")
    public ApiResponse<List<PostListItemResponse>> listPosts(@RequestParam(required = false) String category,
                                                             @RequestParam(required = false) String tag) {
        return ApiResponse.ok(postQueryService.listPosts(category, tag));
    }

    @GetMapping("/posts/{idOrSlug}")
    public ApiResponse<PostDetailResponse> getPost(@PathVariable String idOrSlug) {
        return ApiResponse.ok(postQueryService.getPost(idOrSlug));
    }

    @GetMapping("/categories")
    public ApiResponse<List<LabelValueResponse>> listCategories() {
        return ApiResponse.ok(postQueryService.listCategories());
    }

    @GetMapping("/tags")
    public ApiResponse<List<LabelValueResponse>> listTags() {
        return ApiResponse.ok(postQueryService.listTags());
    }
}
