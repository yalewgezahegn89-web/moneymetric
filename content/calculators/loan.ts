import type { CalculatorSeoContent } from "../types";

export const loanContent: CalculatorSeoContent = {
  slug: "loan",
  intro:
    "Calculate loan payments, total interest, and view an amortization schedule for any standard amortizing loan. This calculator helps you understand how your loan balance decreases over time with fixed periodic payments.",

  howItWorks:
    "A loan payment consists of principal (the amount borrowed) and interest (the cost of borrowing). At the beginning of an amortizing loan, a larger portion of each payment generally goes toward interest. As the balance decreases, more of each payment goes toward principal. This process is called amortization—a scheduled repayment of your loan over a fixed term with regular periodic payments.",

  formula:
    "The standard payment formula for an amortizing loan is: M = L × [i(1+i)^N] / [(1+i)^N - 1], where M is the periodic payment, L is the loan amount, i is the periodic interest rate (annual rate divided by payments per year), and N is the total number of payments (loan term in years multiplied by payments per year). For zero-interest loans, the payment is simply the loan amount divided by the number of payments.",

  example:
    "Consider a $20,000 loan at 8% annual interest over 5 years with monthly payments. The periodic rate is 8% ÷ 12 = 0.667% per month, and there are 60 total payments. Using the formula, your estimated monthly payment is $405.53. Over the full loan term, you would pay approximately $24,331.67 in total, with approximately $4,331.67 going to interest. The amortization chart shows your remaining balance decreasing from $20,000 to $0 over 5 years.",

  interpretation:
    "The calculator shows your estimated periodic payment, the total amount you will pay over the loan term, and the total interest cost. The amortization chart visualizes how your remaining balance declines over time. At the beginning of an amortizing loan, a larger portion of each payment generally covers interest. As the balance decreases, more of each payment reduces your principal.",

  assumptions:
    "This calculator models a standard amortizing loan with fixed interest rate and regular periodic payments. It does not include origination fees, application fees, late fees, prepayment penalties, taxes, insurance, or other lender-specific charges. Your actual loan costs may differ based on jurisdiction-specific conventions and lender-specific methods. Results are estimates and should not be considered a lender quote.",

  faqs: [
    {
      question: "What types of loans can this calculator handle?",
      answer:
        "This calculator handles any standard amortizing loan with fixed interest rate and regular periodic payments, including personal loans, auto loans, student loans, and home equity loans. It supports monthly, biweekly, and weekly payment frequencies.",
    },
    {
      question: "Why does a larger portion of early payments go to interest?",
      answer:
        "At the beginning of a loan, your balance is at its highest, so interest charges are calculated on a larger amount. As you pay down the principal, the interest portion decreases and more of each payment goes toward reducing your balance. This is the nature of amortization.",
    },
    {
      question: "Is this a lender quote?",
      answer:
        "No. This calculator provides estimates based on standard amortization formulas. Actual lender rates, fees, and calculation methods may vary. Always consult with a licensed lender for official loan estimates and terms.",
    },
    {
      question: "How can I reduce my total interest cost?",
      answer:
        "You can reduce total interest by choosing a shorter loan term, making extra principal payments when possible, or securing a lower interest rate. Each strategy reduces either the amount borrowed, the interest rate, or the time over which interest accrues.",
    },
  ],

  relatedCalculatorSlugs: ["mortgage", "compound-interest"],
};
