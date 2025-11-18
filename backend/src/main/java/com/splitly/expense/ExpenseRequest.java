package com.splitly.expense;

import com.splitly.expense.enums.Category;
import com.splitly.expense.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseRequest {

    private String title;
    private BigDecimal amount;
    private Category category;
    private LocalDate date;
    private String description;
    private PaymentMethod paymentMethod;

    @Data
    @Builder
    public static class Share{
        private UUID userId;
        private BigDecimal amountOwed;
    }

    private List<Share> shares;
}
