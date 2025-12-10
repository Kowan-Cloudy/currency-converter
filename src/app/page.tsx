'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'IDR', 'SGD', 'AUD', 'CHF'];

  return (
    <main className="min-h-screen">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 grid-pattern" />
        <div 
          className="hero-gradient bg-foreground left-1/4 top-1/4"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="hero-gradient bg-foreground right-1/4 bottom-1/4"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        />

        {/* Floating currency symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {currencies.map((currency, i) => (
            <div
              key={currency}
              className="absolute font-mono text-6xl lg:text-8xl font-bold opacity-[0.03] select-none"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${15 + (i % 3) * 25}%`,
                transform: `translateY(${scrollY * (0.1 + i * 0.02)}px) rotate(${-10 + i * 5}deg)`,
              }}
            >
              {currency}
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted">Live exchange rates</span>
            </div>
          </div>

          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
            Currency exchange,
            <br />
            <span className="text-muted">in the cloud.</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg lg:text-xl text-muted max-w-2xl mx-auto mb-10">
            Real-time conversion rates for 20+ currencies. 
            Fast, accurate, and beautifully designed.
          </p>

          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/converter" className="btn-primary">
              Start Converting
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up delay-400 mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="font-mono text-3xl lg:text-4xl font-bold">20+</div>
              <div className="text-sm text-muted mt-1">Currencies</div>
            </div>
            <div>
              <div className="font-mono text-3xl lg:text-4xl font-bold">1hr</div>
              <div className="text-sm text-muted mt-1">Rate refresh</div>
            </div>
            <div>
              <div className="font-mono text-3xl lg:text-4xl font-bold">0ms</div>
              <div className="text-sm text-muted mt-1">Conversion</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in delay-500">
          <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              Why FluxRate?
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Built for speed, designed for clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time Rates',
                description: 'Exchange rates updated hourly from trusted financial data sources.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'History Tracking',
                description: 'Every conversion is saved. Review your exchange history anytime.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Global Coverage',
                description: 'Support for 20+ major world currencies, from USD to IDR.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="card p-8 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 lg:py-40">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl lg:text-6xl font-bold mb-6">
            Ready to convert?
          </h2>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
            No sign-up required. Start converting currencies instantly.
          </p>
          <Link href="/converter" className="btn-primary inline-block">
            Open Converter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
                <svg className="w-5 h-5 text-background" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              </div>
              <span className="font-display font-semibold">Cloudy</span>
            </div>
            <p className="text-sm text-muted">
              Cloudy &copy; Komputasi Awan | Gasal 2025/2026
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
