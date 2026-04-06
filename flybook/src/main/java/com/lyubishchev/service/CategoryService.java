package com.lyubishchev.service;

import com.lyubishchev.dto.CategoryDTO;
import com.lyubishchev.entity.Category;
import com.lyubishchev.repository.CategoryRepository;
import com.lyubishchev.repository.RecordRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RecordRepository recordRepository;

    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDTO.builder().id(c.getId()).name(c.getName()).build())
                .toList();
    }

    public CategoryDTO create(CategoryDTO dto) {
        String cleaned = dto.getName() == null ? "" : dto.getName().trim();
        if (cleaned.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "分类名称不能为空");
        }
        if (categoryRepository.existsByName(cleaned)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "分类已存在");
        }

        Category saved = categoryRepository.save(Category.builder().name(cleaned).build());
        return CategoryDTO.builder().id(saved.getId()).name(saved.getName()).build();
    }

    public void delete(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("分类不存在"));

        if (recordRepository.existsByCategoryId(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "该分类下存在记录，不能删除");
        }
        categoryRepository.delete(category);
    }
}
