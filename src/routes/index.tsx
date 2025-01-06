import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import Explore from '../pages/Explore';
import Chat from '../pages/Chat';
import Post from '../pages/Post';
import Create from '../pages/Create';
import Users from '../pages/Users';
import AccountSettings from '../pages/AccountSettings';
import Notifications from '../pages/Notifications';
import DirectChat from '../components/Chat/DirectChat';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes future={{ v7_relativeSplatPath: true }}>
      <Route path="login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
      <Route path="signup" element={!currentUser ? <SignUp /> : <Navigate to="/" />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="explore" element={<Explore />} />
          <Route path="users" element={<Users />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:userId" element={<DirectChat />} />
          <Route path="post/:postId" element={<Post />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings/account" element={<AccountSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}