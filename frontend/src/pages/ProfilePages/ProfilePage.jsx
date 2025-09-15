// src/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import ProfileHeader from '../../components/ProfilePageComponents/ProfileHeader';
import ProjectsSection from '../../components/ProfilePageComponents/ProjectsSection';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: 'Loading...',
    email: '',
    department: '',
    role: '',
    profilePicture: '',
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    isFaculty: false,
    isAvailable: false,
    description: ''
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({
    todo: 0,
    inProgress: 0,
    overdue: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const userResponse = await fetch(`https://server-2dc3.onrender.com/users/${id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUser(userData);

        const projectsResponse = await fetch('https://server-2dc3.onrender.com/projects/my-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: id })
        });
        if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        processTasks(projectsData, id);

      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const processTasks = (projects, userId) => {
    const today = new Date();
    let todo = 0;
    let inProgress = 0;
    let overdue = 0;
    let completed = 0;

    projects.forEach(project => {
      project.todo?.forEach(task => {
        if (task.teamMemberID === userId) {
          const dueDate = new Date(task.enddate);
          dueDate < today ? overdue++ : todo++;
        }
      });

      project.onprogress?.forEach(task => {
        if (task.teamMemberID === userId) {
          const dueDate = new Date(task.enddate);
          dueDate < today ? overdue++ : inProgress++;
        }
      });

      project.review?.forEach(task => {
        if (task.teamMemberID === userId) {
          const dueDate = new Date(task.enddate);
          dueDate < today ? overdue++ : inProgress++;
        }
      });

      project.done?.forEach(task => {
        if (task.teamMemberID === userId) completed++;
      });
    });

    setTasks({ todo, inProgress, overdue, completed });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-center text-red-500">
            <p>Error loading profile:</p>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader user={user} />
        
        <ProjectsSection 
          projects={projects} 
          userId={id}
          tasks={tasks}
        />
      </div>
      
      <span className='text-center text-gray-500 text-sm mb-10 block'>
        A vision of <span className='text-sky-500 font-bold'>FourStacks</span>
      </span>
      
      <ReactTooltip id="github-tooltip" />
      <ReactTooltip id="linkedin-tooltip" />
      <ReactTooltip id="contact-tooltip" />
    </div>
  );
};

export default ProfilePage;