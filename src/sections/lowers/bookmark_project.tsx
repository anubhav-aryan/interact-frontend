import postHandler from '@/handlers/post_handler';
import { setProjectBookmarks, userSelector } from '@/slices/userSlice';
import { Project, ProjectBookmark, ProjectBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
  setBookmark: (isBookmarked: boolean, projectItemID: string, bookmarkID: string) => void;
}

const BookmarkProject = ({ setShow, project, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).projectBookmarks;

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/project`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: ProjectBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setProjectBookmarks(updatedBookmarks));
      Toaster.stopLoad(toaster, 'Bookmark Added', 1);
      setBookmarkTitle('');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
    setMutex(false);
  };

  const addBookmarkItemHandler = async (bookmark: ProjectBookmark) => {
    if (mutex) return;
    setMutex(true);

    const URL = `${BOOKMARK_URL}/project/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: project.id });

    if (res.statusCode === 201) {
      const bookmarkItem: ProjectBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(projectBookmark => {
        if (projectBookmark.id === bookmark.id) {
          const updatedPostItems = projectBookmark.projectItems
            ? [...projectBookmark.projectItems, bookmarkItem]
            : [bookmarkItem];
          return { ...projectBookmark, postItems: updatedPostItems };
        }
        return projectBookmark;
      });
      dispatch(setProjectBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.projectBookmarkID);
    }
    setMutex(false);
  };
  return (
    <>
      <div className="fixed top-12 w-1/3 max-md:w-5/6 h-max bg-slate-100 right-1/2 translate-x-1/2 animate-fade_third z-20">
        <div>BookMark this Project</div>
        {bookmarks.map((bookmark, index: number) => {
          return (
            <div
              key={index}
              className={`w-full h-14 flex justify-center rounded-xl rounded-b-none items-center border-b-2 border-black hover:bg-[#1a1a1a18] cursor-pointer`}
              onClick={() => {
                addBookmarkItemHandler(bookmark);
              }}
            >
              {bookmark.title}
            </div>
          );
        })}
        <form onSubmit={addBookmarkHandler}>
          <input
            className={`w-full h-14 px-2 flex rounded-xl justify-center items-center font-Helvetica bg-[#1a1a1a18] cursor-pointer focus:outline-none`}
            value={bookmarkTitle}
            onChange={el => setBookmarkTitle(el.target.value)}
            placeholder="Create a new Bookmark"
          />
        </form>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-10"
      ></div>
    </>
  );
};

export default BookmarkProject;