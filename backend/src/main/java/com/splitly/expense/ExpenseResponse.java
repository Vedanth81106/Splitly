package com.splitly.expense;

import com.splitly.expense.enums.Category;
import com.splitly.expense.enums.PaymentMethod;
import com.splitly.expense.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseResponse {

    private UUID id;
    private String title;
    private BigDecimal amount;
    private Category category;
    private LocalDate date;
    private String description;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class ShareResponse {
        private UUID shareId;
        private UUID userId;
        private String username;
        private PaymentStatus status;
        private BigDecimal amountOwed;
    }

    private List<ShareResponse> shares;
}
