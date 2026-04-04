package com.finance.dashboard.controller;

import com.finance.dashboard.dto.ApiResponseDTO;
import com.finance.dashboard.dto.DashboardSummaryDTO;
import com.finance.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}/summary")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<DashboardSummaryDTO>> getSummary(@PathVariable Long userId) {
        DashboardSummaryDTO summary = dashboardService.getSummary(userId);
        return ResponseEntity.ok(ApiResponseDTO.success(summary, "Summary fetched"));
    }

    @GetMapping("/{userId}/categories")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getCategoryAnalysis(@PathVariable Long userId) {
        Map<String, Object> analysis = dashboardService.getCategoryAnalysis(userId);
        return ResponseEntity.ok(ApiResponseDTO.success(analysis, "Category analysis fetched"));
    }
}
