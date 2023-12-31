import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, MEMBERSHIP_URL, PROJECT_PIC_URL, PROJECT_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import { initialProject } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, Link, X } from '@phosphor-icons/react';
import LowerProject from '@/components/lowers/lower_project';
import ProjectViewLoader from '@/components/loaders/explore_project_view';
import { useRouter } from 'next/router';
import Collaborators from '@/components/explore/show_collaborator';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import EditProject from './edit_project';
import getDomainName from '@/utils/get_domain_name';
import getIcon from '@/utils/get_icon';
import Links from '@/components/explore/show_links';
import deleteHandler from '@/handlers/delete_handler';
import { useSwipeable } from 'react-swipeable';
interface Props {
  projectSlugs: string[];
  clickedProjectIndex: number;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  fadeIn: boolean;
  setFadeIn: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectView = ({
  projectSlugs,
  clickedProjectIndex,
  setClickedProjectIndex,
  setClickedOnProject,
  fadeIn,
  setFadeIn,
  setProjects,
}: Props) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(true);

  const [clickedOnReadMore, setClickedOnReadMore] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);

  const router = useRouter();

  const user = useSelector(userSelector);

  const fetchProject = async (abortController: AbortController) => {
    setLoading(true);
    let slug = '';
    try {
      slug = projectSlugs[clickedProjectIndex];
    } finally {
      const URL = `${PROJECT_URL}/${slug}`;
      const res = await getHandler(URL, abortController.signal);
      if (res.statusCode == 200) {
        setProject(res.data.project);
        setLoading(false);
      } else {
        if (res.status != -1) {
          if (res.data.message) Toaster.error(res.data.message);
          else Toaster.error(SERVER_ERROR);
        }
      }
    }
  };

  const handleLeaveProject = async () => {
    const toaster = Toaster.startLoad('Leaving this project...');

    const URL = `${MEMBERSHIP_URL}/project/${project.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setProjects) setProjects(prev => prev.filter(p => p.id != project.id));
      setClickedProjectIndex(-1);
      const { query } = router;
      if (router.pathname == '/workspace') {
        delete query.project;

        router.replace({
          pathname: router.pathname,
          query: { ...query },
        });
      }
      setClickedOnProject(false);
      Toaster.stopLoad(toaster, 'Left the Project', 1);
    } else {
      Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
      console.log(res);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProject(abortController);

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, project: projectSlugs[clickedProjectIndex] },
    });

    return () => {
      abortController.abort();

      // const { query } = router;
      // if (router.pathname == '/workspace') {
      //   delete query.project;

      //   router.push({
      //     pathname: router.pathname,
      //     query: { ...query },
      //   });
      // }
    };
  }, [clickedProjectIndex]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const handleClickPrev = () => {
    if (clickedProjectIndex != 0) {
      setClickedProjectIndex(prev => prev - 1);
      setFadeIn(false);
    }
  };

  const handleClickNext = () => {
    if (clickedProjectIndex != projectSlugs.length - 1) {
      setClickedProjectIndex(prev => prev + 1);
      setFadeIn(false);
    }
  };

  const swipeHandler = useSwipeable({
    onSwipedRight: handleClickPrev,
    onSwipedLeft: handleClickNext,
  });

  return (
    <>
      {loading ? (
        <ProjectViewLoader fadeIn={fadeIn} setClickedOnProject={setClickedOnProject} />
      ) : (
        <div
          {...swipeHandler}
          className="w-screen h-screen dark:text-white font-primary fixed top-0 left-0 z-50 flex dark:bg-backdrop backdrop-blur-2xl"
        >
          {clickedOnEdit ? (
            <EditProject
              projectToEdit={project}
              setShow={setClickedOnEdit}
              setProjects={setProjects}
              setProjectToEdit={setProject}
            />
          ) : (
            <></>
          )}
          <div className="max-md:hidden w-16 h-screen flex flex-col items-center py-3 justify-between max-md:fixed max-md:top-0 max-md:left-0">
            <div className="w-10 h-10 relative">
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
                className={'w-10 h-10 rounded-full cursor-default absolute top-0 left-0 z-10'}
              />
              {/* <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${project.memberships[0].user.profilePic}`}
                className={'w-10 h-10 rounded-full cursor-default absolute top-0 left-2'}
              /> */}
            </div>
            {clickedProjectIndex != 0 ? (
              <div
                onClick={handleClickPrev}
                className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretLeft size={24} weight="bold" />
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="w-[calc(100vw-128px)] max-md:w-screen h-screen overflow-hidden pt-3">
            <div className="w-full h-14 flex justify-between max-md:pr-3">
              <div className="grow flex gap-2 max-md:gap-4">
                <Image
                  crossOrigin="anonymous"
                  width={10000}
                  height={10000}
                  alt={'User Pic'}
                  src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
                  className={'md:hidden w-10 h-10 rounded-full cursor-default'}
                />
                <div>
                  <div className="w-fit font-bold cursor-default">{project.title}</div>
                  <div // convert to link
                    className="w-fit text-xs font-medium"
                  >
                    <span
                      onClick={() => router.push(`/explore/user/${project.user.username}`)}
                      className="cursor-pointer hover:underline hover:underline-offset-2"
                    >
                      {project.user.name}{' '}
                    </span>

                    <span>{project.memberships.length > 0 ? `+${project.memberships.length}` : ''}</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setClickedOnProject(false)}
                className="md:hidden w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer"
              >
                <X size={24} weight="bold" />
              </div>
            </div>
            <div className="w-full h-[calc(100vh-56px)] max-md:overflow-y-auto shadow-xl flex max-md:flex-col">
              <Image
                crossOrigin="anonymous"
                className="w-3/4 max-md:w-full h-full max-md:h-96 rounded-tl-md max-md:rounded-none object-cover"
                src={`${PROJECT_PIC_URL}/${project.coverPic}`}
                alt="Project Cover"
                width={10000}
                height={10000}
              />

              <div className="w-1/4 max-md:w-full h-full max-md:h-fit max-md:min-h-[calc(100vh-65px-384px)] overflow-y-auto border-gray-300 border-t-[1px] border-r-[1px] dark:border-0 p-4 bg-white dark:bg-dark_primary_comp_hover flex flex-col gap-4">
                <div className="w-full h-fit flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-3xl text-gradient">{project.title}</div>
                    <div className="md:hidden w-fit">
                      <LowerProject project={project} />
                    </div>
                  </div>

                  <div className="text-sm">
                    {project.description.length > 200 ? (
                      <>
                        {clickedOnReadMore ? (
                          project.description
                        ) : (
                          <>
                            {project.description.substring(0, 200)}
                            <span
                              onClick={() => setClickedOnReadMore(true)}
                              className="text-xs italic opacity-60 cursor-pointer"
                            >
                              {' '}
                              Read More...
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      project.description
                    )}
                  </div>
                  <div className="w-full flex flex-wrap gap-2">
                    {project.tags &&
                      project.tags.map(tag => {
                        return (
                          <div
                            key={tag}
                            className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] border-gray-400  dark:border-dark_primary_btn bg-gray-200 dark:bg-[#20032c41] rounded-lg"
                          >
                            {tag}
                          </div>
                        );
                      })}
                  </div>
                  <Collaborators memberships={project.memberships} />
                  <Links links={project.links} />
                  <Links links={project.privateLinks} title="Private Links" />
                </div>

                <div className="w-full mx-auto flex flex-col gap-2 pb-4">
                  {project.userID == user.id || user.editorProjects.includes(project.id) ? (
                    <div
                      onClick={() => setClickedOnEdit(true)}
                      className="w-full text-lg font-medium border-[1px] border-gray-400 hover:bg-primary_comp_hover active:bg-primary_comp_active  dark:border-dark_primary_btn dark:active:bg-dark_primary_gradient_end py-2 flex-center hover:bg-gradient-to-r dark:hover:from-dark_secondary_gradient_start dark:hover:to-dark_secondary_gradient_end rounded-lg cursor-pointer transition-ease-300"
                    >
                      Edit Project
                    </div>
                  ) : (
                    <></>
                  )}
                  {project.userID == user.id || user.managerProjects.includes(project.id) ? (
                    <div
                      onClick={() => router.push(`/workspace/manage/${projectSlugs[clickedProjectIndex]}`)}
                      className="w-full text-lg font-medium border-[1px] border-gray-400 hover:bg-primary_comp_hover active:bg-primary_comp_active dark:active:bg-dark_primary_gradient_end dark:border-dark_primary_btn py-2 flex-center hover:bg-gradient-to-r dark:hover:from-dark_secondary_gradient_start dark:hover:to-dark_secondary_gradient_end rounded-lg cursor-pointer transition-ease-300"
                    >
                      Manage Project
                    </div>
                  ) : (
                    <></>
                  )}
                  {project.userID != user.id ? (
                    <div
                      onClick={handleLeaveProject}
                      className="w-full text-lg font-medium py-2 flex-center border-[1px] border-primary_danger hover:bg-primary_danger rounded-lg cursor-pointer transition-ease-300"
                    >
                      Leave Project
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-md:hidden w-16 h-screen flex flex-col items-center justify-between py-3 max-md:fixed max-md:top-0 max-md:right-0">
            <div
              onClick={() => setClickedOnProject(false)}
              className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer"
            >
              <X size={24} weight="bold" />
            </div>

            <div className="max-md:hidden">
              <LowerProject project={project} />
            </div>

            {clickedProjectIndex != projectSlugs.length - 1 ? (
              <div
                onClick={handleClickNext}
                className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretRight size={24} weight="bold" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full"></div>
            )}
          </div>
          <div className="md:hidden fixed bottom-3 w-full flex justify-between px-3">
            {clickedProjectIndex != 0 ? (
              <div
                onClick={() => {
                  setClickedProjectIndex(prev => prev - 1);
                  setFadeIn(false);
                }}
                className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretLeft size={24} weight="bold" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full"></div>
            )}
            {clickedProjectIndex != projectSlugs.length - 1 ? (
              <div
                onClick={() => {
                  setClickedProjectIndex(prev => prev + 1);
                  setFadeIn(false);
                }}
                className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretRight size={24} weight="bold" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full"></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectView;
