import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Link from 'next/link';
import FollowBtn from '../common/follow_btn';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';

interface Props {
  user: User;
}

const UserCard = ({ user }: Props) => {
  const [noFollowers, setNoFollowers] = useState(user.noFollowers);
  const loggedInUser = useSelector(userSelector);
  return (
    <div className="w-full font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gray-100 dark:bg-transparent hover:bg-white dark:hover:bg-transparent rounded-lg flex flex-col gap-4 px-5 py-4 transition-ease-300">
      <div className="flex items-center justify-between w-full">
        <Link
          className="flex items-center gap-2 w-fit"
          href={`${user.username != loggedInUser.username ? `/explore/user/${user.username}` : '/profile'}`}
        >
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            className={'rounded-full w-14 h-14 cursor-pointer border-[1px] border-black'}
          />
          <div className="flex flex-col font-light">
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="flex gap-4 text-sm">
              <div>@{user.username}</div>
              <div className="max-md:hidden">•</div>
              <div className="max-md:hidden">
                {noFollowers} Follower{noFollowers > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </Link>
        <FollowBtn toFollowID={user.id} setFollowerCount={setNoFollowers} />
      </div>
      {user.tagline && user.tagline != '' ? (
        <Link
          href={`${user.username != loggedInUser.username ? `/explore/user/${user.username}` : '/profile'}`}
          className="w-full text-sm pl-16"
        >
          {user.tagline}
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserCard;
