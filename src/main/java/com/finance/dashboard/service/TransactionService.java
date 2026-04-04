package com.finance.dashboard.service;

import com.finance.dashboard.dto.TransactionDTO;
import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.Transaction.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.exception.BadRequestException;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public TransactionDTO createTransaction(Long userId, TransactionDTO transactionDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(transactionDTO.getAmount())
                .type(transactionDTO.getType())
                .category(transactionDTO.getCategory())
                .description(transactionDTO.getDescription())
                .transactionDate(transactionDTO.getTransactionDate())
                .build();

        return mapToDTO(transactionRepository.save(transaction));
    }

    public List<TransactionDTO> getTransactions(Long userId, String type, String category, 
                                                 LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Transaction> transactions = transactionRepository.findByUser(user);

        // Apply optional filters
        if (type != null && !type.isEmpty()) {
            try {
                TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
                transactions = transactions.stream()
                        .filter(t -> t.getType() == transactionType)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid transaction type: " + type);
            }
        }

        if (category != null && !category.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                throw new BadRequestException("Start date must be before end date");
            }
            transactions = transactions.stream()
                    .filter(t -> !t.getTransactionDate().isBefore(startDate) && 
                               !t.getTransactionDate().isAfter(endDate))
                    .collect(Collectors.toList());
        }

        return transactions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long transactionId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new BadRequestException("Transaction does not belong to this user");
        }

        return mapToDTO(transaction);
    }

    public TransactionDTO updateTransaction(Long transactionId, Long userId, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new BadRequestException("Transaction does not belong to this user");
        }

        transaction.setAmount(transactionDTO.getAmount());
        transaction.setType(transactionDTO.getType());
        transaction.setCategory(transactionDTO.getCategory());
        transaction.setDescription(transactionDTO.getDescription());
        transaction.setTransactionDate(transactionDTO.getTransactionDate());
        transaction.setUpdatedAt(LocalDateTime.now());

        return mapToDTO(transactionRepository.save(transaction));
    }

    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new BadRequestException("Transaction does not belong to this user");
        }

        transactionRepository.delete(transaction);
    }

    private TransactionDTO mapToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
