function CategorySection() {
  const categories = [
    {
      id: 1,
      name: "Low Light",
      desc: "Thrives in shady spots",
      color: "#4a5a4a",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: "Pet-Friendly",
      desc: "Safe for furry friends",
      color: "#6b7b6b",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M9 17c-2.8-1-4.6-3-3.8-5.3C6 9.4 8 9 11 9s5 .4 5.8 2.7c.8 2.3-1 4.3-3.8 5.3-1 .4-1.6 1.4-1.6 2.5V21h-2v-1.5c0-1.1-.6-2.1-1.6-2.5z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: "Statement Plants",
      desc: "Bold and dramatic",
      color: "#5a6b5a",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: "Easy Care",
      desc: "Hard to kill",
      color: "#7a8a6a",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <section style={{ padding: '70px 48px', backgroundColor: '#faf5f0', textAlign: 'center' }}>
      {/* Subtitle */}
      <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a3a13', fontWeight: 600, marginBottom: '16px' }}>
        Find Your Perfect Plant
      </p>

      {/* Main Title */}
      <h2 style={{ fontSize: '42px', fontFamily: 'Georgia, serif', color: '#1a3a13', fontWeight: 400, lineHeight: 1.2, marginBottom: '16px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
        What kind of plant parent are you?
      </h2>

      {/* Description */}
      <p style={{ fontSize: '15px', color: '#6b6b6b', marginBottom: '48px' }}>
        Tell us about your space and we'll match you with plants that will thrive.
      </p>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {categories.map((item) => (
          <div key={item.id} style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'box-shadow 0.3s' }}>
            {/* Image Placeholder */}
            <div style={{ height: '220px', backgroundColor: item.color, position: 'relative' }}>
            </div>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 18px', gap: '12px' }}>
              {/* Icon circle */}
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8f0e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a3a13' }}>
                {item.icon}
              </div>
              {/* Text */}
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a3a13', margin: 0 }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{item.desc}</p>
              </div>
              {/* Arrow */}
              <span style={{ color: '#1a3a13', fontSize: '18px', flexShrink: 0 }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div style={{ marginTop: '40px' }}>
        <span style={{ fontSize: '14px', color: '#1a3a13', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Or browse all plants <span style={{ fontSize: '16px' }}>→</span>
        </span>
      </div>
    </section>
  );
}

export default CategorySection;