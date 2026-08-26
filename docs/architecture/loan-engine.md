# Loan Engine Architecture

## Overview

The loan engine provides pure amortizing-loan calculations with no external dependencies. It follows the same architectural patterns as the existing compound interest and mortgage engines.

## Core Loan Model

The engine models a standard amortizing loan with:

- Fixed principal amount
- Fixed annual interest rate (percentage)
- Fixed loan term in years
- Configurable payment frequency (monthly, biweekly, weekly)

## Periodic Rate

The periodic interest rate is calculated as:

```
periodicRate = annualInterestRate / 100 / paymentsPerYear
```

For example, 8% annual interest with monthly payments:

```
periodicRate = 8 / 100 / 12 = 0.006667
```

## Payment Count Model

The total number of payments is:

```
numberOfPayments = loanTermYears × paymentsPerYear
```

The engine validates that this produces an integer result using a tolerance of `1e-10`. Non-integral payment counts are rejected with a structured validation error.

## Payment Frequencies

| Frequency  | Payments Per Year |
|------------|-------------------|
| Monthly    | 12                |
| Biweekly   | 26                |
| Weekly     | 52                |

## Amortization Sequence

For each payment, the engine:

1. Calculates interest: `interest = balance × periodicRate`
2. Calculates principal: `principal = payment - interest`
3. Updates remaining balance: `balance = balance - principal`
4. Tracks cumulative principal and interest

## Payment Formula

For positive interest rates, the standard amortization formula is:

```
M = L × [i(1+i)^N] / [(1+i)^N - 1]
```

Where:
- M = monthly payment
- L = loan amount
- i = periodic interest rate
- N = total number of payments

For zero interest rates:

```
M = L / N
```

## Final Payment Handling

The final payment may differ slightly from the regular payment due to floating-point precision. The engine:

- Adjusts the final payment to pay off the remaining balance exactly
- Ensures no negative final balance
- Calculates `totalPayments` as the sum of actual timeline payments (not `regularPayment × numberOfPayments`)

## Zero-Loan Handling

If `loanAmount = 0`, the engine returns:
- `regularPayment = 0`
- `totalPayments = 0`
- `totalInterest = 0`
- `timeline = []`

This is not treated as a validation failure.

## Zero-Interest Handling

If `annualInterestRate = 0`, the engine:
- Uses `regularPayment = loanAmount / numberOfPayments`
- Timeline contains zero interest for all payments
- `totalInterest = 0`
- `totalPayments = loanAmount`

## Precision Policy

- No `toFixed()` calls in mathematical calculations
- Intermediate values maintain full floating-point precision
- Tests use tolerances (typically 0.01) for floating-point comparisons
- Final payment adjustment ensures exact payoff

## Validation Behavior

The engine rejects:
- NaN or Infinity in any numeric field
- Negative loan amount
- Negative interest rate
- Zero or negative loan term
- Invalid payment frequency
- Non-integer payment count

Validation returns structured `LoanValidationError[]` with field-level messages.

## Scope Limitations

This engine implements a core amortizing-loan model. It does NOT attempt to represent:

- Origination fees
- Application fees
- Late fees
- Prepayment penalties
- Extra payments
- APR conversion
- Credit-score adjustments
- Taxes
- Insurance
- Country-specific lending rules
- Lender-specific rounding conventions

## Dependencies

- None (pure TypeScript)
- Uses existing `PAYMENTS_PER_YEAR` constant from engine types

## Testing

The engine includes comprehensive tests covering:
- Reference scenarios with independently verified expected values
- Zero interest and zero loan edge cases
- All payment frequencies
- Various loan terms
- Mathematical identities (total payments, cumulative principal/interest)
- Final payment handling
- Validation of all rejection cases