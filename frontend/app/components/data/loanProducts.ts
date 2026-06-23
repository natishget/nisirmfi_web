export interface LoanProduct {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stat: string;
  // rate: string;
  tenure: string;
  iconName: string;
}

export const loanProducts: LoanProduct[] = [
  {
    id: "enterprise",
    title: "Small and Medium Enterprise (SME)",
    tagline: "Fuel your enterprise growth",
    description:
      "Scale your operations, purchase inventory, or expand your team with flexible business financing.",
    stat: "ETB 12,000,000",
    // rate: "12.5% p.a.",
    tenure: "To 5 Years",
    iconName: "Briefcase",
  },
  {
    id: "business",
    title: "Micro Business Loan",
    tagline: "Seasonal financing for small businesses",
    description:
      "Empowering farmers with timely credit for seeds, equipment, and modern farming techniques.",
    stat: "Up to ETB 500,000",
    // rate: "8.5% p.a.",
    tenure: "To 3 Years",
    iconName: "Leaf",
  },
  {
    id: "vehicle",
    title: "Vehicle Loan",
    tagline: "Drive your ambitions forward",
    description:
      "Get on the road faster with competitive rates for personal and commercial vehicles.",
    stat: "Up to ETB 150,000",
    // rate: "10.5% p.a.",
    tenure: "To 5 Years",
    iconName: "Car",
  },
  {
    id: "bridge",
    title: "Bridge Loan",
    tagline: "Life's moments, financed",
    description:
      "Rapid-access credit for existing customers facing urgent personal or business needs.",
    stat: "Up to 500,000 ETB",
    // rate: "14% p.a.",
    tenure: "To 6 months",
    iconName: "User",
  },
  {
    id: "enterpreneurship",
    title: "Enterpreneurship Loan",
    tagline: "Invest in your future",
    description:
      "Don't let finances hold you back. Fund your higher education with ease.",
    stat: "Up to ETB 200,000",
    // rate: "9% p.a.",
    tenure: "12–120 months",
    iconName: "GraduationCap",
  },
  {
    id: "housing",
    title: "Housing Loan",
    tagline: "Invest in your future",
    description:
      "Don't let finances hold you back. Fund your Dream house with ease.",
    stat: "Up to ETB 200,000",
    // rate: "9% p.a.",
    tenure: "12–120 months",
    iconName: "House",
  },
];
