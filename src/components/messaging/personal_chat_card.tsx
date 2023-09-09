import { Chat } from '@/types';
import Cookies from 'js-cookie';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import getDisplayTime from '@/utils/get_display_time';
import getMessagingUser from '@/utils/get_messaging_user';
import { useDispatch, useSelector } from 'react-redux';
import { currentChatIDSelector, setCurrentChatID } from '@/slices/messagingSlice';

interface Props {
  chat: Chat;
}

const PersonalChatCard = ({ chat }: Props) => {
  const userID = Cookies.get('id');
  const dispatch = useDispatch();

  const currentChatID = useSelector(currentChatIDSelector);
  return (
    <div
      onClick={() => dispatch(setCurrentChatID(chat.id))}
      className={`w-full font-primary text-white ${
        chat.id == currentChatID ? 'bg-[#c578bf36]' : ''
      } border-[1px] border-primary_btn rounded-lg flex gap-4 px-5 py-4 cursor-pointer transition-ease-300`}
    >
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
        className={'rounded-full w-14 h-14 cursor-pointer border-[1px] border-black'}
      />
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <div className="text-xl font-semibold">{getMessagingUser(chat).name}</div>
          <div className="flex flex-col font text-xs">
            {chat.latestMessage ? getDisplayTime(chat.latestMessage.createdAt, false) : ''}
          </div>
        </div>
        {chat.latestMessage ? (
          <div className="w-full line-clamp-2 font-light">
            <span className="mr-2 font-medium">
              • {chat.latestMessage.userID == userID ? 'You' : `${getMessagingUser(chat).username}`}
            </span>
            {chat.latestMessage.content}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PersonalChatCard;
