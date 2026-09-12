import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}

export const PageHeader = ({ eyebrow, title, subtitle }: PageHeaderProps) => (
  <div className="reveal-blur text-center mb-16">
    <span className="inline-block text-xs tracking-[0.22em] uppercase text-primary mb-4">
      {eyebrow}
    </span>
    <h1 className="text-4xl md:text-5xl font-normal">{title}</h1>
    {subtitle && (
      <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
    )}
  </div>
);
