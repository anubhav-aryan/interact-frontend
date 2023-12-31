import Link from 'next/link';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  open: boolean;
}

const SidebarItem = ({ title, icon, active, setActive, index, open }: Props) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`${open ? 'w-[220px]' : 'w-10 '} h-10 p-[8.5px] rounded-lg ${
        active == index
          ? 'bg-primary_comp_hover text-primary_text dark:text-white dark:bg-[#0e0c2a59]'
          : 'hover:bg-gray-200 dark:hover:bg-[#0000002b] text-gray-500 dark:text-white'
      } relative font-primary font-medium items-center transition-ease-out-500`}
    >
      {icon}
      {
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            open ? 'opacity-100 left-[64px]' : 'opacity-0 left-[0px] animate-shrink'
          } transition-ease-500`}
        >
          {title}
        </div>
      }
    </Link>
  );
};

export default SidebarItem;
