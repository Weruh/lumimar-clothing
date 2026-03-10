import React from 'react';
import { getPolicyContent } from '@/lib/sample-data';
import NotFoundPage from '@/pages/NotFoundPage';

export default function PolicyPage({ slug }: { slug: string }) {
  const policy = getPolicyContent(slug);
  if (!policy) {
    return <NotFoundPage />;
  }

  return (
    <section className="bg-soft-cream">
      <div className="container space-y-6 py-10 lg:py-14">
        {slug === 'shipping' ? (
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-deep-gold/80">{policy.label}</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-ebony">{policy.title}</h1>
            <p className="mt-4 text-sm text-ebony/70">{policy.intro}</p>
            <div className="mt-6 space-y-4 text-sm text-ebony/75">
              {policy.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-semibold text-ebony">{section.heading}</h2>
                  {section.body.length > 1 ? (
                    <ul className="mt-2 space-y-2">
                      {section.body.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.body[0]}</p>
                  )}
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-soft space-y-4 text-sm text-ebony/75">
            <p className="text-xs uppercase tracking-[0.3em] text-deep-gold/80">{policy.label}</p>
            <h1 className="font-heading text-3xl font-semibold text-ebony">{policy.title}</h1>
            <p>{policy.intro}</p>
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-semibold text-ebony">{section.heading}</h2>
                {section.ordered ? (
                  <ol className="mt-2 space-y-1 list-decimal pl-5">
                    {section.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                ) : section.body.length > 1 ? (
                  <ul className="mt-2 space-y-1">
                    {section.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.body[0]}</p>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
