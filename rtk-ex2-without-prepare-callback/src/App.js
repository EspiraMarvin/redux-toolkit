import './App.css';
import AddPostForm from './features/posts/AddPostForm';
import PostList from './features/posts/PostList';
import { useEffect, useRef } from 'react'

function App() {
  const isMounted = useRef()
  useEffect(() => {
    if (isMounted.current)  return 
        isMounted.current = true
        console.log('APP.JS run')
  }, [])

  return (
    <main className="App">
      <AddPostForm />
      <PostList />
    </main>
  );
}

export default App;
