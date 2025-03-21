'use client';

import { Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinks: {
  label: string;
  href: string;
  icon: React.ElementType;
}[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'My Bets',
    href: '/users/self',
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className='fixed right-0 bottom-0 left-0 z-[50] block bg-black md:hidden'>
      <div className='flex h-20 items-center'>
        {NavLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex h-full w-full flex-col items-center justify-center text-white ${
              pathname === item.href
                ? 'text-orange-500'
                : 'hover:text-orange-500/80'
            }`}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <item.icon
              className={`size-6 ${
                pathname === item.href ? 'text-orange-500' : ''
              }`}
            />
            <span
              className={`py-1 ${
                pathname === item.href ? 'font-medium' : 'font-normal'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
