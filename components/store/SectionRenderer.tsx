import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SectionRenderer({ section }: { section: any }) {
  const { type, data } = section;

  switch (type) {
    case 'hero':
      return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {data.image_url && (
            <div className="absolute inset-0 -z-10">
              <img src={data.image_url} alt="" className="w-full h-full object-cover opacity-10" />
            </div>
          )}
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-800 leading-[1.1] whitespace-pre-line animate-fade-in-up">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-lg text-stone-500 mt-6 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {data.subtitle}
              </p>
            )}
            {data.buttonText && data.buttonLink && (
              <Link href={data.buttonLink}
                className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-medium px-7 py-3.5 rounded-full mt-8 transition-all animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                {data.buttonText}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>
      );

    case 'text':
      return (
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-5">
            {data.heading && <h2 className="font-display text-2xl font-semibold text-stone-800 mb-4">{data.heading}</h2>}
            <div className="prose text-stone-600 whitespace-pre-line">{data.content}</div>
          </div>
        </section>
      );

    case 'image':
      return (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-5">
            {data.image_url && (
              <figure>
                <img src={data.image_url} alt={data.caption || ''} className="w-full rounded-2xl" />
                {data.caption && <figcaption className="text-sm text-stone-400 text-center mt-3">{data.caption}</figcaption>}
              </figure>
            )}
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-5">
            <div className="bg-sage-500 rounded-3xl px-8 py-12 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-6">{data.title}</h2>
              {data.buttonText && data.buttonLink && (
                <Link href={data.buttonLink}
                  className="inline-flex items-center gap-2 bg-white text-sage-700 font-medium px-7 py-3.5 rounded-full hover:bg-sage-50 transition-all"
                >
                  {data.buttonText}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-5">
            {data.heading && (
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-800 text-center mb-12">
                {data.heading}
              </h2>
            )}
            <div className="grid sm:grid-cols-3 gap-8">
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-sage-600 font-display font-semibold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonial':
      return (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <p className="font-display text-xl sm:text-2xl text-stone-700 leading-relaxed">
              "{data.quote}"
            </p>
            <p className="text-sm text-stone-400 mt-4">— {data.author}</p>
          </div>
        </section>
      );

    case 'spacer':
      const heights = { small: 'h-8', medium: 'h-16', large: 'h-32' };
      return <div className={heights[data.height as keyof typeof heights] || 'h-16'} />;

    default:
      return null;
  }
}
