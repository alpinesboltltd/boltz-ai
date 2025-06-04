export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  image?: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    content: "Boltz.co has transformed our customer support. We've reduced response times by 80% and increased customer satisfaction scores by 35%. The ability to train the chatbot with our own knowledge base makes it incredibly accurate.",
    author: "Sarah Johnson",
    role: "Customer Success Manager",
    company: "TechCorp Inc.",
    industry: "SaaS",
    image: "/testimonials/sarah.jpg",
    rating: 5
  },
  {
    id: '2',
    content: "Setting up our AI chatbot took less than an hour. The no-code builder is incredibly intuitive, and the AI responses are impressively accurate. Our customers love getting instant answers 24/7.",
    author: "Michael Chen",
    role: "E-commerce Director",
    company: "Retail Solutions",
    industry: "E-commerce",
    image: "/testimonials/michael.jpg",
    rating: 5
  },
  {
    id: '3',
    content: "The ability to train our chatbot with our own knowledge base has been game-changing. It now handles 70% of our customer inquiries without human intervention, freeing up our support team to focus on complex issues.",
    author: "Jessica Patel",
    role: "Head of Support",
    company: "SaaS Platform",
    industry: "Technology",
    image: "/testimonials/jessica.jpg",
    rating: 5
  },
  {
    id: '4',
    content: "We integrated Boltz.co with our WhatsApp Business account, and it's been a huge success. Our customers can now get support through their preferred channel, and we've seen a 45% increase in engagement.",
    author: "David Rodriguez",
    role: "Digital Marketing Manager",
    company: "Global Retail",
    industry: "Retail",
    image: "/testimonials/david.jpg",
    rating: 4
  },
  {
    id: '5',
    content: "The analytics dashboard provides invaluable insights into customer questions and pain points. We've used this data to improve our product documentation and even identify new feature opportunities.",
    author: "Emma Wilson",
    role: "Product Manager",
    company: "FinTech Solutions",
    industry: "Finance",
    image: "/testimonials/emma.jpg",
    rating: 5
  },
  {
    id: '6',
    content: "As a small business, we couldn't afford a 24/7 support team. Boltz.co has allowed us to provide round-the-clock support to our global customers without breaking the bank. The ROI has been incredible.",
    author: "James Thompson",
    role: "Founder & CEO",
    company: "Startup Innovations",
    industry: "Technology",
    image: "/testimonials/james.jpg",
    rating: 5
  },
];