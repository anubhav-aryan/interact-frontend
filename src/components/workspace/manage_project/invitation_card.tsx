import { Invitation, Project } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { Pen } from '@phosphor-icons/react';
import moment from 'moment';
import getInvitationStatus from '@/utils/get_invitation_status';

interface Props {
  invitation: Invitation;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const InvitationCard = ({ invitation, project, setProject }: Props) => {
  const user = useSelector(userSelector);
  return (
    <div className="w-full font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md flex justify-start gap-6 p-6 transition-ease-300">
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${invitation.user.profilePic}`}
        className={'rounded-full w-16 h-16'}
      />
      <div className="grow flex flex-col gap-2 pt-1">
        <div className="w-full flex items-center justify-between">
          <div className="grow flex flex-col gap-2">
            <div className="text-2xl font-semibold">{invitation.user.name}</div>
            <div className="font-medium">{invitation.title}</div>
            <div className="font-medium">{'Member'}</div>
          </div>
          <div className="text-lg font-medium pr-4 cursor-default">{getInvitationStatus(invitation.status)}</div>
        </div>

        <div className="w-full flex items-center justify-between text-sm">
          <div className="text-gray-400">Sent {moment(invitation.createdAt).format('DD MMM YYYY')}</div>
          {invitation.status == 0 ? (
            <>
              {project.userID == user.id || user.managerProjects.includes(project.id) ? (
                <div className="text-primary_danger cursor-pointer">Withdraw Invitation</div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
