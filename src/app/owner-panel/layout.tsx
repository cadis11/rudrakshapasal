import type { ReactNode } from 'react';
export const dynamic = 'force-dynamic';
export default function AdminLayout({ children }:{ children:ReactNode }){
  const base = process.env.ADMIN_PANEL_BASEPATH || '/owner-panel';
  const studio = process.env.NEXT_PUBLIC_STUDIO_BASEPATH || '/admin';
  return (
    <main className='rp-container' style={{paddingTop:'1.25rem', paddingBottom:'2rem'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', gap:'1rem'}}>
        <h1 style={{fontSize:'1.5rem', fontWeight:800}}>Admin Panel</h1>
        <nav style={{display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
          <a className='rp-btn' href={base + '/'}>Dashboard</a>
          <a className='rp-btn' href={base + '/orders'}>Orders</a>
          <a className='rp-btn' href={base + '/products'}>Products</a>\n          <a className='rp-btn' href={base + '/reports'}>Reports</a>
          <a className='rp-btn' href={studio}>Open Studio</a>
          <a className='rp-btn' href='/en'>View site</a>
        </nav>
      </header>
      {children}
    </main>
  );
}