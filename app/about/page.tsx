import Link from "next/link";
import Header from "../components/Header";

function About() {
  return (
    <div className="space-y-8">
      <Header text="About" textSubtitle="What this project is for." />

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          This is a learning project for practicing React and Next.js
          fundamentals — components, props, conditional rendering, and hooks.
        </p>
        <p className="text-muted">
          Built with Next.js 16, React 19, and Tailwind CSS 4.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block text-sm font-medium text-accent hover:underline"
      >
        ← Back to the playground
      </Link>
    </div>
  );
}

export default About;
