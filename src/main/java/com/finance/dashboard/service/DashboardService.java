package com.finance.dashboard.service;

import com.finance.dashboard.dto.DashboardSummaryDTO;
import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.Transaction.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public DashboardSummaryDTO getSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        BigDecimal totalIncome = transactionRepository.sumByUserAndType(user, TransactionType.INCOME)
                .orElse(BigDecimal.ZERO);

        BigDecimal totalExpense = transactionRepository.sumByUserAndType(user, TransactionType.EXPENSE)
                .orElse(BigDecimal.ZERO);

        BigDecimal netBalance = totalIncome.subtract(totalExpense);
        long transactionCount = transactionRepository.countByUser(user);

        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .transactionCount(transactionCount)
                .build();
    }

    public Map<String, Object> getCategoryAnalysis(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Transaction> transactions = transactionRepository.findByUser(user);

        BigDecimal totalAmount = transactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> categoryBreakdown = new LinkedHashMap<>();

        transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getCategory, 
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)))
                .forEach((category, amount) -> {
                    double percentage = totalAmount.compareTo(BigDecimal.ZERO) > 0
                            ? (amount.doubleValue() / totalAmount.doubleValue()) * 100
                            : 0.0;

                    Map<String, Object> categoryData = new LinkedHashMap<>();
                    categoryData.put("total", amount);
                    categoryData.put("percentage", String.format("%.2f", percentage) + "%");
                    categoryData.put("count", transactions.stream()
                            .filter(t -> t.getCategory().equals(category))
                            .count());

                    categoryBreakdown.put(category, categoryData);
                });

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("categories", categoryBreakdown);
        result.put("totalAmount", totalAmount);
        return result;
    }
}
