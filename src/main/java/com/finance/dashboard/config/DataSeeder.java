package com.finance.dashboard.config;

import com.finance.dashboard.dto.TransactionDTO;
import com.finance.dashboard.dto.UserCreationDTO;
import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.Transaction.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, 
                     TransactionRepository transactionRepository,
                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Delete transactions first (they have foreign key references to users)
        transactionRepository.deleteAll();
        // Then delete users
        userRepository.deleteAll();

        seedUsers();
    }

    private void seedUsers() {
        // Create Admin User
        User adminUser = User.builder()
                .username("admin")
                .email("admin@finance.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("Admin User")
                .role(User.UserRole.ADMIN)
                .status(User.UserStatus.ACTIVE)
                .build();
        User savedAdmin = userRepository.save(adminUser);

        // Create Analyst User
        User analystUser = User.builder()
                .username("analyst")
                .email("analyst@finance.com")
                .password(passwordEncoder.encode("Analyst@123"))
                .fullName("John Analyst")
                .role(User.UserRole.ANALYST)
                .status(User.UserStatus.ACTIVE)
                .build();
        User savedAnalyst = userRepository.save(analystUser);

        // Create Viewer User
        User viewerUser = User.builder()
                .username("viewer")
                .email("viewer@finance.com")
                .password(passwordEncoder.encode("Viewer@123"))
                .fullName("Jane Viewer")
                .role(User.UserRole.VIEWER)
                .status(User.UserStatus.ACTIVE)
                .build();
        User savedViewer = userRepository.save(viewerUser);

        // Seed transactions for Admin User
        seedTransactionsForUser(savedAdmin);

        // Seed transactions for Analyst User
        seedTransactionsForUser(savedAnalyst);

        // Seed transactions for Viewer User
        seedTransactionsForUser(savedViewer);
    }

    private void seedTransactionsForUser(User user) {
        // Income transactions
        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("5000.00"))
                .type(TransactionType.INCOME)
                .category("Salary")
                .description("Monthly salary deposit")
                .transactionDate(LocalDate.now().minusDays(15))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("500.00"))
                .type(TransactionType.INCOME)
                .category("Freelance")
                .description("Freelance project payment")
                .transactionDate(LocalDate.now().minusDays(10))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("200.00"))
                .type(TransactionType.INCOME)
                .category("Interest")
                .description("Bank interest received")
                .transactionDate(LocalDate.now().minusDays(5))
                .build());

        // Expense transactions
        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("1200.00"))
                .type(TransactionType.EXPENSE)
                .category("Rent")
                .description("Monthly rent payment")
                .transactionDate(LocalDate.now().minusDays(20))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("150.00"))
                .type(TransactionType.EXPENSE)
                .category("Utilities")
                .description("Electricity and water bills")
                .transactionDate(LocalDate.now().minusDays(18))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("450.00"))
                .type(TransactionType.EXPENSE)
                .category("Groceries")
                .description("Weekly grocery shopping")
                .transactionDate(LocalDate.now().minusDays(12))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("80.00"))
                .type(TransactionType.EXPENSE)
                .category("Transportation")
                .description("Gas and vehicle maintenance")
                .transactionDate(LocalDate.now().minusDays(8))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("300.00"))
                .type(TransactionType.EXPENSE)
                .category("Entertainment")
                .description("Movie tickets and dining out")
                .transactionDate(LocalDate.now().minusDays(3))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("100.00"))
                .type(TransactionType.EXPENSE)
                .category("Healthcare")
                .description("Doctor appointment and medicine")
                .transactionDate(LocalDate.now().minusDays(2))
                .build());

        transactionRepository.save(Transaction.builder()
                .user(user)
                .amount(new BigDecimal("75.00"))
                .type(TransactionType.EXPENSE)
                .category("Internet")
                .description("Monthly internet subscription")
                .transactionDate(LocalDate.now())
                .build());
    }
}
