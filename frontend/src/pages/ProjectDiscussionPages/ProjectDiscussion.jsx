import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import MessageArea from '../../components/ProjectDiscussionComponents/MessageArea.jsx';
import Header from '../../components/Header.jsx';
import DiscussStatistics from '../../components/ProjectDiscussionComponents/DiscussStatistics.jsx';
import FileStack from '../../components/ProjectDiscussionComponents/FileStack.jsx';
import UserContext from '../../Context/UserContext';
import Error403 from '../../pages/AuthPages/Error403Page';

const socket = io('http://localhost:8000');

const ProjectDiscussion = () => {
  const { id: projectID } = useParams();
  const { user } = useContext(UserContext); 
  const [messages, setMessages] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/projects/${projectID}`);
        if (!res.ok) {
          console.error('Failed to fetch project data');
          setHasAccess(false);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProjectData(data);

        // Check if user is in teamMembers array or is the team lead
        const isTeamMember = data.teamMembers?.some(
          (member) => member.userid === user?.id
        ) || user?.id === data.teamLeadId;

        setHasAccess(isTeamMember);
      } catch (err) {
        console.error('Error checking access:', err.message);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProject();
  }, [projectID, user?.id]);

  useEffect(() => {
    if (!hasAccess) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/messages/${projectID}`);
        const data = await res.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    socket.emit('joinProject', projectID);
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveProject', projectID);
    };
  }, [projectID, hasAccess]);

  const handleNewMessage = useCallback((newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    if (!user?.id || !user?.username) {
      alert('User not found');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectID,
          senderID: user.id,
          name: user.username,
          message: messageContent
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <Error403/>;
  }

  return (
    <>
      <Header />
      <div className='grid grid-cols-8 mt-3 mx-2'>
        <DiscussStatistics 
          teamMembers={projectData?.teamMembers || []} 
          projectName={projectData?.projectName || ''} 
        />
        <MessageArea 
          messages={messages}
          currentUserId={user?.id}
          onSendMessage={handleSendMessage}
        />
        <FileStack projectID={projectID} />
      </div>
    </>
  );
};

export default ProjectDiscussion;