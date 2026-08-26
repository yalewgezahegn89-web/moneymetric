import type { CalculatorSeoContent } from "../types";

export const mortgageContent: CalculatorSeoContent = {
  slug: "mortgage",
  intro:
    "Estimate your monthly mortgage payment and see how your loan balance decreases over time. This calculator helps you understand the principal and interest components of a standard amortizing mortgage.",

  howItWorks:
    "A mortgage payment consists of principal (the amount borrowed) and interest (the cost of borrowing). In the early years of your loan, most of your payment goes toward interest. As you pay down the balance, more of each payment goes toward principal. This process is called amortization—a scheduled repayment of your loan over a fixed term.",

  formula:
    "The standard monthly payment formula for a fixed-rate mortgage is: M = P × [r(1+r)^n] / [(1+r)^n - 1], where M is the monthly payment, P is the loan principal (home price minus down payment), r is the monthly interest rate (annual rate divided by 12), and n is the total number of monthly payments (loan term in years × 12). For zero-interest loans, the payment is simply the loan amount divided by the number of payments.",

  example:
    "Consider a home priced at $400,000 with an $80,000 down payment, resulting in a $320,000 loan. At 6.5% annual interest over 30 years (360 monthly payments), your estimated monthly payment is $2,022.62. Over the full loan term, you would pay approximately $728,143 in total, with approximately $408,143 going to interest. The amortization chart shows your remaining balance decreasing from $320,000 to $0 over 30 years.",

  interpretation:
    "The calculator shows your estimated monthly principal and interest payment, the total amount you will pay over the loan term, and the total interest cost. The amortization chart visualizes how your remaining balance declines over time. In the early years, a larger portion of each payment covers interest. As the balance decreases, more of each payment reduces your principal.",

  assumptions:
    "This calculator estimates principal and interest only. It does not include property taxes, homeowners insurance, private mortgage insurance (PMI), homeowner association (HOA) fees, closing costs, or other lender-specific charges. Your actual monthly housing payment will be higher when these costs are included. Results are estimates and should not be considered a lender quote. Actual lender calculations may differ based on jurisdiction-specific conventions and lender-specific methods.",

  faqs: [
    {
      question: "What does this mortgage calculator include?",
      answer:
        "This calculator estimates principal and interest only. It does not include property taxes, homeowners insurance, PMI, HOA fees, closing costs, or other expenses. Your total monthly housing cost will be higher than the figure shown here.",
    },
    {
      question: "Why does most of my early payment go to interest?",
      answer:
        "In the early years of a mortgage, your loan balance is at its highest, so interest charges are calculated on a larger amount. As you pay down the principal, the interest portion decreases and more of each payment goes toward reducing your balance. This is the nature of amortization.",
    },
    {
      question: "Is this a lender quote?",
      answer:
        "No. This calculator provides estimates based on standard amortization formulas. Actual lender rates, fees, and calculation methods may vary. Always consult with a licensed lender for official loan estimates and terms.",
    },
    {
      question: "How can I reduce my total interest cost?",
      answer:
        "You can reduce total interest by making a larger down payment, choosing a shorter loan term (such as 15 years instead of 30), or making extra principal payments when possible. Each strategy reduces either the amount borrowed or the time over which interest accrues.",
    },
  ],

  relatedCalculatorSlugs: ["compound-interest"],
  relatedGuideSlugs: ["how-mortgage-amortization-works"],
};