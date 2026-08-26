import type { Guide } from "../types";

export const mortgageAmortizationGuide: Guide = {
  slug: "how-mortgage-amortization-works",
  title: "How Mortgage Amortization Works",
  description:
    "Understand how mortgage amortization works, why early payments contain more interest, and how your loan balance declines over time with the Mortgage Calculator.",
  category: "Loans",
  relatedCalculatorSlug: "mortgage",
  intro:
    "A mortgage is one of the largest financial commitments most people make. Understanding how amortization works helps you see where your payments go and how your loan balance decreases over time.",

  sections: [
    {
      heading: "What Is Amortization?",
      paragraphs: [
        "Amortization is the process of paying off a loan through scheduled, regular payments over a fixed term. Each payment covers both principal (the amount borrowed) and interest (the cost of borrowing).",
        "In a typical fixed-rate mortgage, your monthly payment remains the same throughout the loan term, but the split between principal and interest changes with each payment.",
      ],
    },
    {
      heading: "Principal vs. Interest",
      paragraphs: [
        "The principal is the portion of your payment that reduces your loan balance. Interest is the lender's charge for lending you the money. In the early years of a mortgage, a larger share of each payment goes toward interest because the loan balance is at its highest.",
        "As you pay down the principal, the interest portion decreases because interest is calculated on the remaining balance. This gradual shift is the core of amortization.",
      ],
    },
    {
      heading: "How Each Payment Is Calculated",
      paragraphs: [
        "For a fixed-rate mortgage, the monthly payment is calculated using a standard amortization formula that considers the loan amount, interest rate, and loan term. The formula ensures that by the end of the term, the loan balance reaches exactly zero.",
        "The formula for a standard monthly payment is: M = P × [r(1+r)^n] / [(1+r)^n - 1], where M is the monthly payment, P is the loan principal, r is the monthly interest rate, and n is the total number of payments.",
      ],
    },
    {
      heading: "Why Early Payments Contain More Interest",
      paragraphs: [
        "In the first month, interest is calculated on the full loan amount. Since the balance is at its maximum, the interest portion of your payment is at its highest. The remaining portion goes toward reducing the principal.",
        "In the second month, interest is calculated on the slightly reduced balance. Each subsequent month, the interest portion shrinks and the principal portion grows, even though the total payment stays the same.",
      ],
      callout:
        "This is why making extra principal payments early in your loan term can significantly reduce the total interest you pay over the life of the mortgage.",
    },
    {
      heading: "How the Outstanding Balance Declines",
      paragraphs: [
        "The amortization schedule shows your remaining balance after each payment. The balance declines slowly at first and then more rapidly as the principal portion of each payment increases.",
        "For a 30-year mortgage, you may pay off only 15-20% of the principal in the first 10 years. The remaining 80-85% is paid off in the final 20 years. This is the nature of amortization, not a flaw in the loan structure.",
      ],
    },
    {
      heading: "Worked Example",
      paragraphs: [
        "Consider the following scenario using the MoneyMetric Mortgage Calculator:",
      ],
      list: [
        "Home price: $400,000",
        "Down payment: $80,000",
        "Loan amount: $320,000",
        "Annual interest rate: 6.5%",
        "Loan term: 30 years",
        "Payment frequency: Monthly",
      ],
      callout:
        "Based on these assumptions, the estimated monthly principal and interest payment is approximately $2,022.62. Over the full 30-year term, you would pay approximately $728,000 in total, with approximately $408,000 going to interest. The amortization chart shows your remaining balance declining from $320,000 to $0 over 30 years.",
    },
    {
      heading: "How to Use the Mortgage Calculator",
      paragraphs: [
        "The MoneyMetric Mortgage Calculator estimates your monthly principal and interest payment based on the home price, down payment, interest rate, loan term, and payment frequency you enter.",
        "The calculator also shows your total payments, total interest, and provides an amortization chart that visualizes how your remaining balance declines over time. You can adjust any input to see how changes affect your payment.",
      ],
    },
    {
      heading: "What the Calculator Excludes",
      paragraphs: [
        "The MoneyMetric Mortgage Calculator estimates principal and interest only. It does not include:",
      ],
      list: [
        "Property taxes",
        "Homeowners insurance",
        "Private mortgage insurance (PMI)",
        "Homeowner association (HOA) fees",
        "Closing costs",
        "Lender-specific fees or charges",
      ],
      callout:
        "Your actual monthly housing payment will be higher when these costs are included. Always consult with a licensed lender for official loan estimates that include all applicable costs.",
    },
    {
      heading: "Limitations and Assumptions",
      paragraphs: [
        "This calculator provides estimates based on the assumptions you enter. It assumes a fixed interest rate over the entire loan term, which is typical for conventional fixed-rate mortgages but may not apply to adjustable-rate mortgages.",
        "Actual lender calculations may differ based on jurisdiction-specific conventions, lender-specific methods, and rounding conventions. Results are estimates and should not be considered a lender quote.",
      ],
    },
  ],

  faqs: [
    {
      question: "What is mortgage amortization?",
      answer:
        "Amortization is the process of paying off a loan through scheduled regular payments over a fixed term. Each payment covers both principal and interest, with the principal portion increasing over time as the loan balance decreases.",
    },
    {
      question: "Why does a larger share of early payments go to interest?",
      answer:
        "In the early years, your loan balance is at its highest, so interest charges are calculated on a larger amount. As you pay down the principal, the interest portion decreases and more of each payment reduces your balance.",
    },
    {
      question: "Does this calculator include property taxes?",
      answer:
        "No. The MoneyMetric Mortgage Calculator estimates principal and interest only. It does not include property taxes, homeowners insurance, PMI, HOA fees, closing costs, or other expenses. Your total monthly housing cost will be higher.",
    },
    {
      question: "Why might a lender's calculation differ?",
      answer:
        "Lenders may use different calculation methods, rounding conventions, or jurisdiction-specific rules. Additionally, your actual rate and terms may differ from the assumptions entered in the calculator. Always consult with a licensed lender for official estimates.",
    },
  ],

  relatedGuideSlugs: [],
  lastUpdated: "2026-08-26",
};