import { useSelector } from 'react-redux'
import { selectAllPosts } from "./postsSlice"
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'

const PostList = () => {
    
    const posts = useSelector(selectAllPosts)

    // display most recent posts
    // slice() creates a new array(a shallow copy of the arr), 
    // localeCompare returns 1,0 or -1 if one is greater than the other, 
    // we then sort based on values from localeCompare
    
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

    const renderedPosts = orderedPosts.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <p className='postCredit'>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    ))

    return (
      <section>
          <h2>Posts</h2>
          {renderedPosts}
      </section>
  )
}

export default PostList