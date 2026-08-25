# Compound Interest Engine

## Mathematical Model

The engine calculates future value of an investment with compound interest and recurring contributions.

### Initial Investment

The initial investment follows the standard compound interest formula:

```
A = P(1 + r/n)^(nt)
```

Where:
- P = initial investment
- r = annual interest rate as decimal (e.g., 7% = 0.07)
- n = compounding periods per year
- t = investment duration in years

### Recurring Contributions

Contributions are modeled separately from the initial investment. Each contribution earns compound interest from the time it is added until the end of the investment period.

### Effective Annual Rate (EAR)

The effective annual rate accounts for intra-year compounding:

```
EAR = (1 + r/n)^n - 1
```

Where:
- r = nominal annual interest rate as decimal
- n = compounding periods per year

For example, a nominal 7% rate compounded monthly produces an EAR of approximately 7.229%.

## Supported Frequencies

### Contribution Frequencies

| Frequency | Periods per Year |
|-----------|------------------|
| monthly | 12 |
| quarterly | 4 |
| annually | 1 |

### Compounding Frequencies

| Frequency | Periods per Year |
|-----------|------------------|
| annually | 1 |
| semi-annually | 2 |
| quarterly | 4 |
| monthly | 12 |
| daily | 365 |

## Contribution Timing

All contributions occur at the **end** of each contribution period. This is a standard financial convention and is explicitly declared in the result assumptions.

For example, monthly contributions over 10 years produce exactly 120 contributions at times t=1/12, t=2/12, ..., t=120/12=10.

## Handling Differing Frequencies

The engine uses an explicit event-sorted timeline approach:

1. Generate all compound events at their scheduled times
2. Generate all contribution events at their scheduled end-of-period times
3. Sort all events by time (compound events before contributions at identical times)
4. Process events sequentially:
   - At compound events: apply growth for the elapsed time since the last event
   - At contribution events: add the contribution to the balance

This correctly handles all frequency combinations, including cases where contribution and compounding times do not align. Contributions placed between compounding events earn proportional interest for the elapsed fraction of the compounding period.

### Growth Calculation for Partial Periods

When processing a compound event, the growth factor is calculated as:

```
growthFactor = (1 + r/n)^(elapsed * n)
```

Where `elapsed` is the exact time in years since the last event. This ensures that:
- Events at different times receive proportional growth
- No growth is applied beyond the requested investment end time
- Partial compounding periods are handled correctly

## Fractional Investment Duration

The engine correctly handles fractional investment years (e.g., 2.5 years). The final compound event occurs at exactly the requested end time. No growth is applied beyond this point.

For example, with 2.5 years and monthly contributions:
- Exactly 30 contributions occur at t=1/12, t=2/12, ..., t=30/12=2.5
- The final compound event occurs at t=2.5
- No events occur after t=2.5

## Precision Policy

- **No rounding** of intermediate calculations
- **No currency formatting** in the engine
- **No `toFixed()`** for core mathematical results
- Full numeric precision is maintained throughout
- Final display rounding occurs in the UI/formatting layer

## Validation Behavior

The engine validates all inputs before calculation. Invalid inputs produce structured error arrays with field-level messages.

### Rejected Values

- NaN or Infinity for any numeric field
- Negative initial investment
- Negative contribution
- Negative interest rate
- Investment years <= 0
- Unsupported contribution frequency
- Unsupported compounding frequency

## Edge Cases

The engine correctly handles:

- Initial investment = 0
- Regular contribution = 0
- Interest rate = 0
- Both initial and contribution = 0
- One-year investment
- Fractional investment durations
- Large but reasonable values (e.g., $1M initial, 30 years)
- All valid frequency combinations

At 0% interest, future value equals initial investment plus total contributions, and total interest is 0.
