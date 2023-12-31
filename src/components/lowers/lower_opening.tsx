import React, { useState, useEffect } from 'react';
import { Opening, OpeningBookmark } from '@/types';
import deleteHandler from '@/handlers/delete_handler';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setOpeningBookmarks, userSelector } from '@/slices/userSlice';
// import clickedOnSharePost from './clickedOnShare_project';
import BookmarkSimple from '@phosphor-icons/react/dist/icons/BookmarkSimple';
import Gear from '@phosphor-icons/react/dist/icons/Gear';
import Export from '@phosphor-icons/react/dist/icons/Export';
import { BOOKMARK_URL } from '@/config/routes';
import { setUpdateBookmark } from '@/slices/configSlice';
import BookmarkOpening from '@/sections/lowers/bookmark_opening';
import ShareOpening from '@/sections/lowers/share_opening';

interface Props {
  opening: Opening;
}

interface bookMarkStatus {
  isBookmarked: boolean;
  openingItemID: string;
  bookmarkID: string;
}

const LowerOpening = ({ opening }: Props) => {
  const [bookmarkStatus, setBookmarkStatus] = useState<bookMarkStatus>({
    isBookmarked: false,
    openingItemID: '',
    bookmarkID: '',
  });
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [mutex, setMutex] = useState(false);

  const bookmarks = useSelector(userSelector).openingBookmarks;

  const user = useSelector(userSelector);

  const dispatch = useDispatch();
  const router = useRouter();

  const setBookmark = (isBookmarked: boolean, openingItemID: string, bookmarkID: string) => {
    setBookmarkStatus({
      isBookmarked,
      openingItemID,
      bookmarkID,
    });
  };

  function removePostItemFromBookmark(
    bookmarks: OpeningBookmark[],
    bookmarkId: string,
    openingItemID: string
  ): OpeningBookmark[] {
    const updatedBookmarks = bookmarks.map(bookmark => {
      if (bookmark.id === bookmarkId) {
        const updatedPostItems = bookmark.openingItems.filter(item => item.id !== openingItemID);
        return { ...bookmark, projectItems: updatedPostItems };
      }
      return bookmark;
    });

    return updatedBookmarks;
  }

  useEffect(() => {
    bookmarks.forEach(bookmarksObj => {
      if (bookmarksObj.openingItems)
        bookmarksObj.openingItems.forEach(openingItem => {
          if (openingItem.openingID == opening.id) setBookmark(true, openingItem.id, bookmarksObj.id);
        });
    });
  }, []);

  const removeBookmarkItemHandler = async () => {
    if (mutex) return;
    setMutex(true);
    setBookmark(false, bookmarkStatus.openingItemID, bookmarkStatus.bookmarkID);

    const URL = `${BOOKMARK_URL}/opening/item/${bookmarkStatus.openingItemID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      const updatedBookmarks = removePostItemFromBookmark(
        bookmarks,
        bookmarkStatus.bookmarkID,
        bookmarkStatus.openingItemID
      );
      dispatch(setOpeningBookmarks(updatedBookmarks));
      setBookmark(false, '', '');
      dispatch(setUpdateBookmark(true));
    } else {
      setBookmark(true, bookmarkStatus.openingItemID, bookmarkStatus.bookmarkID);
    }
    setMutex(false);
  };

  return (
    <>
      {clickedOnBookmark ? (
        <BookmarkOpening setShow={setClickedOnBookmark} opening={opening} setBookmark={setBookmark} />
      ) : (
        <></>
      )}
      {clickedOnShare ? <ShareOpening setShow={setClickedOnShare} opening={opening} /> : <></>}
      <div className="flex gap-4">
        {user.id == opening?.userID || user.editorProjects.includes(opening.projectID) ? (
          <Gear
            className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
            onClick={() => {
              router.push(`/workspace/manage/${opening.project.slug}?action=edit&oid=${opening.id}`);
            }}
            size={32}
            weight="light"
          />
        ) : (
          <></>
        )}
        <Export
          onClick={() => setClickedOnShare(true)}
          className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
          size={32}
          weight="duotone"
        />
        <BookmarkSimple
          className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
          onClick={() => {
            if (bookmarkStatus.isBookmarked) removeBookmarkItemHandler();
            else setClickedOnBookmark(prev => !prev);
          }}
          size={32}
          weight={bookmarkStatus.isBookmarked ? 'duotone' : 'light'}
        />
      </div>
    </>
  );
};

export default LowerOpening;
