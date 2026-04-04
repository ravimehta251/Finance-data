package com.finance.dashboard.repository;

import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.Transaction.TransactionType;
import com.finance.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndType(User user, TransactionType type);

    List<Transaction> findByUserAndCategory(User user, String category);

    List<Transaction> findByUserAndTransactionDateBetween(User user, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserAndTypeAndTransactionDateBetween(User user, TransactionType type, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    Optional<BigDecimal> sumByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user")
    long countByUser(@Param("user") User user);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND YEAR(t.transactionDate) = :year AND MONTH(t.transactionDate) = :month")
    List<Transaction> findByUserAndYearMonth(@Param("user") User user, @Param("year") int year, @Param("month") int month);
}
