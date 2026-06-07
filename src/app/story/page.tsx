export default function StoryPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }} className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="label-tag mb-4" style={{ color: '#D4A017' }}>Our Story</p>
          <h1 className="text-4xl font-medium leading-tight" style={{ fontWeight: 500 }}>
            From Kerala&apos;s farms<br />to your table.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <p className="label-tag mb-3" style={{ color: '#1B4332' }}>How It Began</p>
            <p className="text-sm leading-relaxed text-gray-700">
              SpiNuts started in a kitchen in Kerala, where my grandmother would hand-sort spices before every meal.
              She&apos;d never buy from a store what she could source from the farm next door. That principle — pure,
              direct, uncompromised — became the foundation of everything we do.
            </p>
          </div>

          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }} className="pt-8">
            <p className="label-tag mb-3" style={{ color: '#1B4332' }}>The Problem We Solve</p>
            <p className="text-sm leading-relaxed text-gray-700">
              The spice supply chain is broken. By the time whole spices reach your kitchen, they&apos;ve passed
              through 4–6 middlemen, been stored in warehouses for months, and often adulterated or processed.
              You pay premium prices for a fraction of the original quality.
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-4">
              We fix this by working directly with farming families in Kerala and Tamil Nadu. We buy at harvest,
              pack within days, and ship directly to you. No warehouses. No adulteration. No middlemen.
            </p>
          </div>

          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }} className="pt-8">
            <p className="label-tag mb-3" style={{ color: '#1B4332' }}>Our Sourcing Principles</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Direct from Farmers', desc: 'We know every family we source from by name. Fair prices, long relationships.' },
                { title: 'Whole, Not Powdered', desc: 'We sell whole spices. Grinding is the last step — yours to do, ensuring maximum freshness.' },
                { title: 'No Preservatives', desc: 'No anti-caking agents, no artificial colours, no blending. What you see is what you get.' },
                { title: 'Traceable Origins', desc: 'Every product lists its source region. We can tell you the district and sometimes the village.' },
              ].map((item) => (
                <div key={item.title} className="p-5" style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
                  <p className="label-tag mb-2" style={{ color: '#1B4332' }}>{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }} className="pt-8">
            <p className="label-tag mb-3" style={{ color: '#1B4332' }}>About Amigoz</p>
            <p className="text-sm leading-relaxed text-gray-700">
              SpiNuts is a brand by Amigoz — a family-run business committed to bringing authentic South Indian
              products to homes across India and the world. We believe in quality over quantity, in stories over
              marketing, and in the power of honest food.
            </p>
          </div>
        </div>
      </section>

      {/* Kerala section */}
      <section style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { region: 'Wayanad', products: 'Black Pepper, Coffee', note: 'High altitude hill district known for bold peppercorns' },
            { region: 'Idukki', products: 'Cardamom, Cloves', note: 'The spice garden of Kerala, rich volcanic soil' },
            { region: 'Kollam', products: 'Cashews, Coconut', note: 'India\'s cashew capital, coastal farms' },
          ].map((r) => (
            <div key={r.region} className="p-6" style={{ border: '0.5px solid rgba(255,248,240,0.1)' }}>
              <p className="label-tag mb-1" style={{ color: '#D4A017' }}>{r.region}, Kerala</p>
              <p className="font-medium text-sm mb-2">{r.products}</p>
              <p className="text-xs" style={{ color: 'rgba(255,248,240,0.6)' }}>{r.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
