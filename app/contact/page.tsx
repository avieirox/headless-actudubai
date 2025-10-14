import Container from "@/components/Container";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | ACTU Dubai",
    description: "Get in touch with ACTU Dubai.",
  };
}

export default function ContactPage() {
  return (
    <Container>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Contact</h1>
        <p>
          For press or partnership inquiries, please reach out via email.
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a>
        </p>
        <p>
          We typically respond within 1–2 business days.
        </p>
      </div>
    </Container>
  );
}

