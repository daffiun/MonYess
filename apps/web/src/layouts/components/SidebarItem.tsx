import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  collapsed: boolean;
}

export const SidebarItem = ({ icon: Icon, label, to, collapsed }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative',
        isActive
          ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        collapsed && 'justify-center px-0'
      )
    }
    title={collapsed ? label : ''}
  >
    {({ isActive }) => (
      <>
        <Icon
          size={22}
          className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600')}
        />
        {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</span>}

        {collapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {label}
          </div>
        )}
      </>
    )}
  </NavLink>
);
