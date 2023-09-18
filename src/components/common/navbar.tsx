import Notifications from '@/sections/navbar/notifications';
import { unreadNotificationsSelector } from '@/slices/feedSlice';
import { Bell, ChatCircleDots } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { userSelector } from '@/slices/userSlice';
import ProfileDropdown from '@/sections/navbar/profile_dropdown';
import Link from 'next/link';

const Navbar = () => {
  const notifications = useSelector(unreadNotificationsSelector);
  const [clickedOnNotifications, setClickedOnNotifications] = useState(false);
  const [clickedOnProfile, setClickedOnProfile] = useState(false);
  const user = useSelector(userSelector);
  return (
    <>
      <div className={`${clickedOnNotifications ? '' : 'hidden'}`}>
        <Notifications setShow={setClickedOnNotifications} />
      </div>
      <div className={`${clickedOnProfile ? '' : 'hidden'}`}>
        <ProfileDropdown setShow={setClickedOnProfile} />
      </div>
      <div className="w-full h-navbar bg-navbar glassMorphism backdrop-blur-sm fixed top-0 flex justify-between px-4 items-center z-20">
        <ReactSVG src="/onboarding_logo.svg" />
        {user.isLoggedIn ? (
          <div className="flex items-center gap-2 z-0">
            <Link
              className="w-10 h-10 rounded-full flex-center hover:bg-primary_comp_hover transition-ease-300"
              href={'/messaging'}
            >
              <ChatCircleDots color="white" className="max-md:w-8 max-md:h-8" size={24} weight="regular" />
            </Link>
            <div
              onClick={() => {
                setClickedOnProfile(false);
                setClickedOnNotifications(prev => !prev);
              }}
              className="w-10 h-10 rounded-full flex-center relative hover:bg-primary_comp_hover transition-ease-300"
            >
              {notifications > 0 ? (
                <div className="w-4 h-4 animate-pulse rounded-full absolute top-0 right-0 flex items-center justify-center text-xs bg-black text-white">
                  {notifications}
                </div>
              ) : (
                <></>
              )}
              <Bell className="cursor-pointer max-md:w-8 max-md:h-8" color="white" size={24} weight="regular" />
            </div>
            <Image
              crossOrigin="anonymous"
              className="w-9 h-9 max-md:w-8 max-md:h-8 rounded-full cursor-pointer"
              onClick={() => {
                setClickedOnNotifications(false);
                setClickedOnProfile(prev => !prev);
              }}
              width={10000}
              height={10000}
              alt="user"
              src={`${USER_PROFILE_PIC_URL}/${user.profilePic != '' ? user.profilePic : 'default.jpg'}`}
            />
          </div>
        ) : (
          <>Login, SignUp</>
        )}
      </div>
    </>
  );
};

export default Navbar;
