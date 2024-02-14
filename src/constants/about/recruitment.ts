export interface RecruitmentItem {
  id: number;
  content?: string;
  sideNote?: string;
}

export interface CareerItems extends RecruitmentItem {
  department: string;
  title: string;
  jd: string;
}

interface StaffBenefitType {
  title: string;
  content: string[];
}

export const careerOpportunity: CareerItems[] = [
  {
    id: 1,
    department: "R&D",
    title: "Frontend Engineer",
    jd: "lorem ipsum",
  },
  {
    id: 2,
    department: "R&D",
    title: "Backend Engineer",
    jd: "lorem ipsum",
  },
  {
    id: 3,
    department: "R&D",
    title: "Backend Engineer",
    jd: "lorem ipsum",
  },
  {
    id: 4,
    department: "R&D",
    title: "DevOps Engineer",
    jd: "lorem ipsum",
  },
  {
    id: 5,
    department: "HR",
    title: "HR Manager",
    jd: "lorem ipsum",
  },
  {
    id: 6,
    department: "Marketing",
    title: "Marketing Manager",
    jd: "lorem ipsum",
  },
  {
    id: 7,
    department: "Sales",
    title: "Sales Specialist",
    jd: "lorem ipsum",
  },
  {
    id: 8,
    department: "Accounting",
    title: "Accounting Manager",
    jd: "lorem ipsum",
  },
];

export const staffBenefit: RecruitmentItem[] = [
  {
    id: 1,
    content: "1. 12 days Paid Annual Leave",
  },
  {
    id: 2,
    content: "2. 6 Rests Days Per Month",
  },
  {
    id: 3,
    content: "3. Meal allowance $1,200",
  },
  {
    id: 4,
    content: "4. Special Allowance $1,200 ",
    sideNote: "(Applicable to HK Island/Tung Chung/TKO)",
  },
  {
    id: 5,
    content: "5. New Joiner Bonus $5,000",
  },
  {
    id: 6,
    content: "6. Referral Bonus $4,000",
  },
  {
    id: 7,
    content: "7. Monthly Sales Incentive",
  },
  {
    id: 8,
    content: "8. Overtime Allowance",
  },
  {
    id: 9,
    content: "9. Staff Purchase Discounts",
  },
  {
    id: 10,
    content: "10. Birthday Dining Voucher $500",
  },
  {
    id: 11,
    content: "11. Medical & Dental Benefits",
  },
  {
    id: 12,
    content: "12. Full Paid Leave",
    sideNote: "(covering Marriage, Maternity, Paternity, Birthday, Compassionate, Grandchildren Birth)",
  },
  {
    id: 13,
    content: "13. Excellent Career Progression",
  },
];

export const StaffBenefitConstanst: StaffBenefitType[] = [
  {
    title: "dayOffAmountAndLeaves",
    content: [
      "78 days of Rest Day per year",
      "12-14 days of Annual Leave per year",
      "3 days of Statutory Holidays per year",
      "Staff Full-Paid Leave (including Marriage Leave, Maternity Leave, Paternity Leave, Birthday Leave, Grandparents Leave and Compassionate Leave)",
    ],
  },
  {
    title: "Bonus",
    content: [
      "Incentive Scheme",
      "Meal Allowance $1,200",
      "Over Time Allowance (Supervisor grade and below)",
      "District Allowance $1,000 (Hong Kong Island / Tseung Kwan O / Tung Chung)",
      "New Joiner Bonus $5,000",
      "Staff Referral Bonus $4,000",
    ],
  },
  {
    title: "OtherBenefits",
    content: [
      "Birthday Dining Voucher",
      "Group Discount Privileges",
      "Medical Benefits",
      "Promotion Opportunities",
      "Employee Recreational Activities",
    ],
  },
];
