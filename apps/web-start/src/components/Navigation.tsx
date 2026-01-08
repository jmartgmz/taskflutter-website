import { Link } from '@tanstack/react-router';
import {
  CheckCircle2,
  Home,
  ListTodo,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/catch', label: 'Catch', icon: Sparkles },
  { path: '/completed', label: 'Completed', icon: CheckCircle2 },
  { path: '/shop', label: 'Shop', icon: ShoppingBag },
];

export function Navigation() {
  // Simple navigation without active state for SSR compatibility
  // TanStack Router's Link will handle the routing

  return (
    <nav className="bg-linear-to-r from-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Sparkles className="w-8 h-8 text-white mr-2" />
            <span className="text-white font-bold text-xl">
              Catching Butterflies
            </span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded transition-colors text-white hover:bg-white/20 [&.active]:bg-white [&.active]:text-purple-600 [&.active]:font-semibold"
                  activeOptions={{ exact: item.path === '/' }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
