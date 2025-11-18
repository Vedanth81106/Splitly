package com.splitly.expense;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/all")
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(){
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable UUID expenseId){

        return ResponseEntity.ok(expenseService.getExpenseById(expenseId));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@RequestBody ExpenseRequest expenseRequest){

        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.createExpense(expenseRequest));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable UUID expenseId,
                                                         @RequestBody ExpenseRequest request){

        return ResponseEntity.status(HttpStatus.OK).body(expenseService.updateExpense(expenseId,request));
    }

    @PatchMapping("/share/{shareId}/pay")
    public ResponseEntity<Void> payExpenseShare(@PathVariable UUID shareId){

        expenseService.payExpenseShare(shareId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID expenseId){

        expenseService.deleteExpense(expenseId);

        return ResponseEntity.noContent().build();
    }
}
