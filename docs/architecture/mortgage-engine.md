# Mortgage Engine

## Mathematical Model

The mortgage engine calculates principal-and-interest amortization for a fixed-rate loan.

### Loan Amount

```
loanAmount = homePrice - downPayment
```

Where:
- `homePrice` ≥ 0
- `downPayment` ≥ 0
- `downPayment` ≤ `homePrice`

### Amortization Formula

For a loan with principal `L`, annual rate `r`, payments per year `p`, and total payments `N`:

```
Periodic rate: i = r / p
Number of payments: N = loanTermYears × p

For positive interest:
M = L × [i(1+i)^N] / [(1+i)^N - 1]

For zero interest:
M = L / N
```

### Payment Frequency

| Frequency | Payments per Year |
|-----------|-------------------|
| monthly | 12 |
| biweekly | 26 |
| weekly | 52 |

## Amortization Process

For each payment:

1. Calculate interest on current balance: `interest = balance × periodicRate`
2. Calculate principal: `principal = payment - interest`
3. Update remaining balance: `balance = balance - principal`
4. Update cumulative totals

## Final Payment Adjustment

The final payment may differ slightly from the regular payment to account for floating-point residue. The final payment is calculated as:

```
finalPayment = remainingBalance + finalInterest
```

This ensures the remaining balance reaches exactly zero (within floating-point tolerance).

## Zero-Interest Behavior

When the annual interest rate is 0%, the periodic rate is 0 and each payment consists entirely of principal:

```
payment = loanAmount / numberOfPayments
```

Total payments equal the loan amount, and total interest is zero.

## Zero-Loan Behavior

When `homePrice = downPayment`, the loan amount is 0. The engine returns:
- `regularPayment = 0`
- `totalPayments = 0`
- `totalInterest = 0`
- `timeline = []`

This is not treated as an error.

## Validation

The engine validates all inputs before calculation:

- Rejects NaN, Infinity for all numeric fields
- Rejects negative home price, down payment, interest rate
- Rejects down payment exceeding home price
- Rejects loan term ≤ 0
- Rejects unsupported payment frequency
- Rejects loan terms producing non-integer payment counts

## Precision Policy

- No rounding of intermediate calculations
- No `toFixed()` in the engine
- Full numerical precision throughout
- Tolerances used in tests for floating-point comparisons

## Jurisdiction Limitation

This engine implements a standard US-style fixed-rate amortization model. It does not attempt to reproduce:

- Country-specific mortgage conventions
- Variable-rate mortgages
- Interest-only periods
- Negative amortization
- Canadian mortgage rules (semi-annual compounding)
- UK-specific repayment structures

## Excluded Items

The following are intentionally excluded:

- Property taxes
- Homeowner's insurance
- Private mortgage insurance (PMI)
- HOA fees
- Closing costs
- Points/discounts
- Extra-payment logic
- Escrow calculations

These belong in a comprehensive mortgage calculator with country-specific rules, which is outside the scope of this core engine.
