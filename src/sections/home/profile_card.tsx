import { USER_PROFILE_PIC_URL } from '@/config/routes';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';
import { initialUser } from '@/types/initials';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { ArrowDownLeft } from '@phosphor-icons/react';
import Loader from '@/components/common/loader';
import ProfileCardLoader from '@/components/loaders/feed_profile_card';
import Connections from '../explore/connections_view';

const ProfileCard = () => {
  const [user, setUser] = useState(initialUser);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [clickedOnFollowers, setClickedOnFollowers] = useState(false);
  const [clickedOnFollowing, setClickedOnFollowing] = useState(false);

  const fetchUser = () => {
    const URL = `/users/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setUser(res.data.user);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {clickedOnFollowers ? <Connections type="followers" user={user} setShow={setClickedOnFollowers} /> : <></>}
      {clickedOnFollowing ? <Connections type="following" user={user} setShow={setClickedOnFollowing} /> : <></>}
      {loading ? (
        <ProfileCardLoader />
      ) : (
        <div
          className={`${
            open
              ? 'w-[24vw] h-[75vh] pb-4 max-md:mb-12 gap-4 pt-8 max-md:pb-8 max-md:pt-4 px-4 top-[150px]'
              : 'w-[48px] h-[48px] pb-0 gap-0 pt-12 px-0 top-[90px]'
          } shadow-md dark:shadow-none transition-ease-500 max-md:h-fit sticky overflow-y-hidden overflow-x-hidden max-md:mx-auto font-primary flex flex-col dark:text-white items-center bg-white dark:bg-[#84478023] backdrop-blur-md border-[1px] border-gray-300 dark:border-dark_primary_btn max-md:hidden max-md:bg-transparent rounded-md z-10`}
        >
          <ArrowDownLeft
            onClick={() => setOpen(prev => !prev)}
            className={`absolute ${
              open ? 'top-0 right-0' : 'top-2 right-2 rotate-180'
            } text-gray-500 dark:text-white transition-ease-500 cursor-pointer`}
            size={32}
          />
          {loading ? (
            <Loader />
          ) : (
            <>
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                className={`rounded-full max-md:mx-auto ${
                  open ? 'w-44 h-44' : 'w-0 h-0'
                } border-gray-500 border-[1px] dark:border-0 transition-ease-500 cursor-default`}
              />
              <div
                className={`${
                  open ? 'text-3xl max-md:text-2xl' : 'text-xxs'
                } transition-ease-500 text-center font-bold text-gradient`}
              >
                {user.name}
              </div>
              <div className={`${open ? 'text-sm' : 'text-xxs'} transition-ease-500 text-center line-clamp-6`}>
                {user.bio || 'Add a Professional Bio'}
              </div>
              <div
                className={`w-full ${
                  open ? 'text-base gap-6' : 'text-xxs gap-0'
                } transition-ease-500 flex justify-center`}
              >
                <div onClick={() => setClickedOnFollowers(true)} className="flex gap-1 cursor-pointer">
                  <div className="font-bold">{user.noFollowers}</div>
                  <div>Follower{user.noFollowers != 1 ? 's' : ''}</div>
                </div>
                <div onClick={() => setClickedOnFollowing(true)} className="flex gap-1 cursor-pointer">
                  <div className="font-bold">{user.noFollowing}</div>
                  <div>Following</div>
                </div>
              </div>

              <div
                className={`w-full ${
                  open ? 'gap-2 mt-12' : 'gap-0 mt-0'
                } transition-ease-500 flex flex-wrap items-center justify-center`}
              >
                {user.tags &&
                  user.tags.map(tag => {
                    return (
                      <Link
                        href={`/explore?search=` + tag}
                        onClick={() => dispatch(setExploreTab(2))}
                        className={`flex-center ${
                          open ? 'text-sm px-4 py-1' : 'text-xxs px-0 py-0'
                        } transition-ease-500 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md`}
                        key={tag}
                      >
                        {tag}
                      </Link>
                    );
                  })}
              </div>
              <Link
                href={'/profile?action=edit'}
                className={`w-[120px] ${
                  open ? 'mt-12' : 'mt-0'
                } transition-ease-500 p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r dark:hover:from-dark_secondary_gradient_start dark:hover:to-dark_secondary_gradient_end rounded-lg`}
              >
                Edit
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileCard;
