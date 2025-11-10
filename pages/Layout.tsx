
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
    const { t, language } = useAppContext();

    const navItems = [
        { to: '/dashboard', label: t('nav.dashboard'), Icon: LayoutDashboard },
        { to: '/add-expense', label: t('nav.add_expense'), Icon: PlusCircle },
        { to: '/settings', label: t('nav.settings'), Icon: SettingsIcon },
    ];

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "md:flex-row md:px-4 md:py-2",
            isActive ? "text-white bg-white/10" : "text-gray-300 hover:bg-white/5 hover:text-white"
        );

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 p-4 space-y-4 bg-slate-900/50 border-r border-white/10">
                <h1 className="text-2xl font-bold text-center">Expense Tracker</h1>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink key={to} to={to} className={navLinkClass}>
                           <Icon className="w-5 h-5" />
                           <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden flex justify-around p-2 bg-slate-900/80 backdrop-blur-sm border-t border-white/10 sticky bottom-0">
                     {navItems.map(({ to, label, Icon }) => (
                        <NavLink key={to} to={to} className={navLinkClass}>
                           <Icon className="w-6 h-6" />
                           <span className="text-xs">{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Layout;
