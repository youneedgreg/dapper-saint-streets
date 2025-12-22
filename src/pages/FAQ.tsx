import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, Visa, Mastercard, and American Express. All transactions are processed securely."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery within Nairobi takes 1-2 business days. Other areas in Kenya take 3-5 business days. Express delivery is available for an additional fee."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Refunds are processed within 7-10 business days."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information. You can also track your order by logging into your account and visiting the Orders section."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within Kenya. We're working on expanding to other East African countries soon."
    },
    {
      question: "How do I determine my size?",
      answer: "Each product page includes a size guide. We recommend measuring yourself and comparing to our size charts for the best fit. If you're between sizes, we suggest sizing up."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of placement. After that, the order goes into processing and cannot be changed. Contact our support team immediately if you need assistance."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at support@dappersaint.com, call us at +254 712 345 678, or use the contact form on our website. We respond within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-muted-foreground">
                Find answers to common questions about orders, shipping, and more.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <a href="/contact" className="text-primary hover:underline font-medium">
                Contact our support team
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
