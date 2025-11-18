package com.splitly.expense;

import com.splitly.expense.enums.PaymentStatus;
import com.splitly.user.User;
import com.splitly.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final ExpenseShareRepository expenseShareRepository;

    private User getAuthenticatedUser(){

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    private ExpenseResponse toResponse(Expense expense){

        List<ExpenseResponse.ShareResponse> shareDTOs = expense.getShares().stream()
                .map(share -> {

                    return ExpenseResponse.ShareResponse.builder()
                            .userId(share.getUser().getId())
                            .amountOwed(share.getAmountOwed())
                            .username(share.getUser().getUsername())
                            .status(share.getStatus())
                            .build();
                })
                .toList();

        return ExpenseResponse.builder()
                .id(expense.getUuid())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .date(expense.getDate())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .paymentMethod(expense.getPaymentMethod())
                .createdAt(expense.getCreatedAt())
                .shares(shareDTOs)
                .build();
    }

    private Expense validExpense(UUID expenseId){

        User user = getAuthenticatedUser();

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        boolean creator = expense.getCreator().getId().equals(user.getId());
        boolean hasShare = expense.getShares().stream()
                .anyMatch(share -> share.getUser().getId().equals(user.getId()));

        if(!creator && !hasShare){
            throw new SecurityException("Access denied: You are not involved in this expense");
        }

        return expense;
    }

    private void createNewShares(Expense expense, ExpenseRequest request){
        User user = getAuthenticatedUser();

        if (request.getAmount().compareTo(BigDecimal.valueOf(0)) <= 0) throw new IllegalArgumentException("Invalid amount");

        if(request.getShares() == null || request.getShares().isEmpty() ){
            var share = ExpenseShare.builder()
                    .amountOwed(request.getAmount())
                    .user(user)
                    .expense(expense)
                    .status(PaymentStatus.PAID)
                    .build();

            expenseShareRepository.save(share);
        }else{
            for(ExpenseRequest.Share share : request.getShares()){

                User shareUser = userRepository.findById(share.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + share.getUserId()));
                var expenseShare = ExpenseShare.builder()
                        .expense(expense)
                        .user(shareUser)
                        .amountOwed(share.getAmountOwed())
                        .status(PaymentStatus.UNPAID)
                        .build();

                expenseShareRepository.save(expenseShare);
            }
        }
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request){

        User user = getAuthenticatedUser();

        var expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .date(request.getDate())
                .category(request.getCategory())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .creator(user)
                .build();

        expenseRepository.save(expense);

        createNewShares(expense,request);

        return toResponse(expense);
    }

    public List<ExpenseResponse> getAllExpenses(){

        User user = getAuthenticatedUser();
        List<ExpenseShare> shares = expenseShareRepository.findByUserId(user.getId());

        return shares.stream()
                .map(ExpenseShare::getExpense)
                .distinct()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(UUID expenseId){

        Expense expense = validExpense(expenseId);
        return toResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(UUID expenseId, ExpenseRequest request){

        Expense expense = validExpense(expenseId);

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());

        expenseShareRepository.deleteAll(expense.getShares());
        createNewShares(expense,request);

        expenseRepository.save(expense);

        return toResponse(expense);
    }

    @Transactional
    public void payExpenseShare(UUID shareId){

        User user = getAuthenticatedUser();
        ExpenseShare share = expenseShareRepository.findById(shareId)
                .orElseThrow(() -> new RuntimeException("Expense share with specified ID was not found!"));

        boolean isCreator = share.getExpense().getCreator().getId().equals(user.getId());
        boolean isOwner = share.getUser().getId().equals(user.getId());

        if (!isCreator && !isOwner) { throw new SecurityException("Access denied"); }

        share.setStatus(PaymentStatus.PAID);
        expenseShareRepository.save(share);
    }

    @Transactional
    public void deleteExpense(UUID expenseId){

        Expense expense = validExpense(expenseId);
        expenseShareRepository.deleteAll(expense.getShares());
        expenseRepository.delete(expense);
    }
}
