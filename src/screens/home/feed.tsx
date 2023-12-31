import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import { Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import NewPost from '@/sections/home/new_post';
import ProfileCard from '@/sections/home/profile_card';
import { navbarOpenSelector, setHomeTab } from '@/slices/feedSlice';
import RePostComponent from '@/components/home/repost';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

const Feed = () => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [clickedOnNewPost, setClickedOnNewPost] = useState(false);
  const [loading, setLoading] = useState(true);

  let profilePic = useSelector(userSelector).profilePic;

  const open = useSelector(navbarOpenSelector);

  const dispatch = useDispatch();

  const getFeed = () => {
    const URL = `/feed?page=${page}&limit=${5}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedFeed = [...feed, ...res.data.feed];
          if (addedFeed.length === feed.length) setHasMore(false);
          setFeed(addedFeed);
          setPage(prev => prev + 1);
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
    getFeed();
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);

  return (
    <div className={`w-full flex ${open ? 'gap-2' : 'gap-12'} transition-ease-out-500`}>
      {clickedOnNewPost ? <NewPost setFeed={setFeed} setShow={setClickedOnNewPost} /> : <></>}
      {/* Create a New Post */}
      <div className="w-[50vw] px-6 max-md:px-4 max-md:w-screen flex flex-col gap-2">
        <div
          onClick={() => setClickedOnNewPost(true)}
          className="w-full h-taskbar mx-auto shadow-md text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 dark:shadow-outer flex justify-between items-center"
        >
          <div className="flex gap-2 items-center pl-2">
            <Image
              crossOrigin="anonymous"
              className="w-8 h-8 rounded-full"
              width={10000}
              height={10000}
              alt="user"
              src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
            />
            <div className="font-primary">Create a post</div>
          </div>
          <Plus
            size={36}
            className="flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
            weight="regular"
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {feed.length === 0 ? (
              <div
                onClick={() => dispatch(setHomeTab(1))}
                className="w-full h-24 rounded-md border-gray-300 border-[1px] bg-white dark:bg-transparent flex-center cursor-pointer"
              >
                Click on Discover to Find What&apos;s Going On!
              </div>
            ) : (
              <InfiniteScroll
                className="flex flex-col gap-4 dark:gap-0"
                dataLength={feed.length}
                next={getFeed}
                hasMore={hasMore}
                loader={<Loader />}
              >
                {feed.map(post => {
                  if (post.rePost) return <RePostComponent key={post.id} setFeed={setFeed} post={post} />;
                  else return <PostComponent key={post.id} setFeed={setFeed} post={post} />;
                })}
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
      <ProfileCard />
    </div>
  );
};

export default Feed;
