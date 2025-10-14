import Container from "@/components/Container";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About | ACTU Dubai",
    description: "Learn more about ACTU Dubai and our editorial approach.",
  };
}

export default function AboutPage() {
  return (
    <Container>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1>About ACTU Dubai</h1>
        <p>
          ACTU Dubai is a financial news portal focused on timely coverage,
          market insights, and practical analysis. Our mission is to deliver
          clear, reliable and concise information for decision-makers.
        </p>
        <h2>Editorial Principles</h2>
        <ul>
          <li>Accuracy and clarity above all.</li>
          <li>Useful context and sources when available.</li>
          <li>Continuous improvements based on reader feedback.</li>
        </ul>
      </div>
    </Container>
  );
}

