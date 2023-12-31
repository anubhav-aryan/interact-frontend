import { GroupChatMessage, Message } from '@/types';
import RegularMessage from '@/components/messaging/regular_message';
import SharedPostMessage from '@/components/messaging/shared_post_message';
import SharedProjectMessage from '@/components/messaging/shared_project_message';
import SharedOpeningMessage from '@/components/messaging/shared_opening_message';
import SharedProfileMessage from '@/components/messaging/shared_profile_message';

interface Props {
  date: string;
  messages: Message[] | GroupChatMessage[];
}

const MessageGroup = ({ date, messages }: Props) => {
  return (
    <div className="flex flex-col gap-4 mx-2 dark:text-white font-primary pt-4 pb-2">
      <div className="w-full text-center text-sm">{date}</div>
      <div className="flex flex-col-reverse gap-6">
        {messages.map(message => {
          if (message.postID != null) return <SharedPostMessage message={message} />;
          else if (message.projectID != null) return <SharedProjectMessage message={message} />;
          else if (message.openingID != null) return <SharedOpeningMessage message={message} />;
          else if (message.profileID != null) return <SharedProfileMessage message={message} />;
          else return <RegularMessage message={message} />;
        })}
      </div>
    </div>
  );
};

export default MessageGroup;
