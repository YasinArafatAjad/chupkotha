import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNav />
      <main className="container mx-auto px-4 pt-20 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}