import { redirect } from 'next/navigation';
export default function Page(){
  const base = process.env.ADMIN_PANEL_BASEPATH || '/owner-panel';
  redirect(base + '/products');
}