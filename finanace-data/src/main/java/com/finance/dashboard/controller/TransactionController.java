package com.finance.dashboard.controller;

import com.finance.dashboard.dto.ApiResponseDTO;
import com.finance.dashboard.dto.TransactionDTO;
import com.finance.dashboard.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<TransactionDTO>> create(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO created = transactionService.createTransaction(userId, transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success(created, "Transaction created"));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<TransactionDTO>>> list(
            @PathVariable Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<TransactionDTO> transactions = transactionService.getTransactions(userId, type, category, startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions, "Transactions fetched"));
    }

    @GetMapping("/{userId}/{transactionId}")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<TransactionDTO>> getById(
            @PathVariable Long userId,
            @PathVariable Long transactionId) {
        TransactionDTO transaction = transactionService.getTransactionById(transactionId, userId);
        return ResponseEntity.ok(ApiResponseDTO.success(transaction, "Transaction fetched"));
    }

    @PutMapping("/{userId}/{transactionId}")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<TransactionDTO>> update(
            @PathVariable Long userId,
            @PathVariable Long transactionId,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO updated = transactionService.updateTransaction(transactionId, userId, transactionDTO);
        return ResponseEntity.ok(ApiResponseDTO.success(updated, "Transaction updated"));
    }

    @DeleteMapping("/{userId}/{transactionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<?>> delete(
            @PathVariable Long userId,
            @PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId, userId);
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Transaction deleted"));
    }
}
