import { Project } from '@/types';
import { Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';
import NewOpening from '@/sections/workspace/manage_project/new_opening';
import OpeningCard from '@/components/workspace/manage_project/opening_card';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';

interface Props {
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const Openings = ({ project, setProject }: Props) => {
  const [clickedOnNewOpening, setClickedOnNewOpening] = useState(false);
  const user = useSelector(userSelector);
  return (
    <div className="w-[50vw] max-md:w-screen mx-auto flex flex-col gap-8">
      {clickedOnNewOpening ? (
        <>
          {project.userID == user.id || user.managerProjects.includes(project.id) ? (
            <NewOpening setShow={setClickedOnNewOpening} project={project} setProject={setProject} />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <div
        onClick={() => setClickedOnNewOpening(true)}
        className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 shadow-sm dark:shadow-outer flex justify-between items-center"
      >
        <div className="flex gap-2 items-center pl-2">
          <div className="font-primary dark:text-gray-200 text-lg">Create a new opening</div>
        </div>
        <Plus
          size={36}
          className="flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
          weight="regular"
        />
      </div>

      {project.openings ? (
        <div className="w-full flex flex-col gap-2">
          {project.openings.map(opening => {
            return <OpeningCard key={opening.id} opening={opening} project={project} setProject={setProject} />;
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Openings;
