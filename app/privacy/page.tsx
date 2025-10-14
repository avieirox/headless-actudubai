import Container from "@/components/Container";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy | ACTU Dubai",
    description: "Our approach to data, cookies and privacy.",
  };
}

export default function PrivacyPage() {
  return (
    <Container>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p>
          We value your privacy. This website may use essential cookies for
          core functionality and analytics to improve user experience.
        </p>
        <h2>Data</h2>
        <p>
          We do not sell personal data. If you contact us, your email may be
          stored to reply and provide support.
        </p>
        <h2>Cookies</h2>
        <p>
          Cookies may be used to remember preferences (such as theme) and to
          measure anonymous usage metrics.
        </p>
        <p>
          For any questions, please reach out via our Contact page.
        </p>
      </div>
    </Container>
  );
}

