import { Helmet } from 'react-helmet-async';
import CreatePost from '../components/Post/CreatePost';

export default function Create() {
  return (
    <>
      <Helmet>
        <title>Create Post | ChupKotha</title>
      </Helmet>
      <div className="container mx-auto max-w-2xl py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Post</h1>
        <CreatePost />
      </div>
    </>
  );
}