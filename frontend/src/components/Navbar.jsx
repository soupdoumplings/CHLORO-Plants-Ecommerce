function Navbar() {
  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="bg-[#f5dcc3] text-[#1a3a13] text-[13px] py-2.5 text-center tracking-wide">
        It's Our Birthday!{" "}
        <span className="underline cursor-pointer font-medium">Save up to 67% on All Plants</span>
      </div>

      {/* Main Nav */}
      <nav className="bg-[#faf8f5] border-b border-gray-200" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px' }}>
        {/* Logo - thinner weight */}
        <h1
          style={{ fontFamily: "'Ingrid Darling', cursive", fontWeight: 300, minWidth: '180px' }}
          className="text-4xl text-[#1a3a13]"
        >
          Petals and Pots
        </h1>

        {/* Menu Links - bigger font */}
        <ul style={{ display: 'flex', gap: '36px', listStyle: 'none', margin: 0, padding: 0 }} className="text-[13px] font-medium uppercase tracking-[0.05em] text-[#1a3a13]">
          <li className="cursor-pointer hover:opacity-70 transition-opacity" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            Plants <span style={{ fontSize: '14px', lineHeight: 1 }}>˅</span>
          </li>
          <li className="cursor-pointer hover:opacity-70 transition-opacity" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            Care Tools <span style={{ fontSize: '14px', lineHeight: 1 }}>˅</span>
          </li>
          <li className="cursor-pointer hover:opacity-70 transition-opacity" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            Gifts <span style={{ fontSize: '14px', lineHeight: 1 }}>˅</span>
          </li>
          <li className="cursor-pointer hover:opacity-70 transition-opacity">Learn</li>
          <li className="cursor-pointer hover:opacity-70 transition-opacity" style={{ whiteSpace: 'nowrap' }}>Corporate Gifts</li>
        </ul>

        {/* Icons - tighter spacing like ref */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }} className="text-[#1a3a13]">
          {/* Search Icon */}
          <span className="cursor-pointer hover:opacity-70 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          {/* User Icon */}
          <span className="cursor-pointer hover:opacity-70 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          {/* Cart Icon - with subtle border like ref */}
          <span className="cursor-pointer hover:opacity-70 transition-opacity" style={{ border: '1.5px solid #1a3a13', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
