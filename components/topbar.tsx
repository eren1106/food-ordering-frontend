import Link from 'next/link'
import React from 'react'
import LinkButton from './link-button';

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/orders",
    label: "Orders",
  },
];

const Topbar = () => {
  return (
    <nav className='w-full fixed top-0 z-50 h-16 border-b px-3 flex items-center justify-end backdrop-blur-xl bg-background bg-opacity-20'>
      <div className='w-full flex justify-between items-center'>
        <Link href="/" className='flex items-center gap-2'>
          <p className='text-lg md:text-2xl font-extrabold'>OrFood</p>
        </Link>
        <div className='gap-4 flex'>
          {
            NAV_ITEMS.map((item) => (
              <LinkButton key={item.to} variant="secondary" href={item.to}>{item.label}</LinkButton>
            ))
          }
        </div>
      </div>
    </nav>
  )
}

export default Topbar