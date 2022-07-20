import { useSelector } from 'react-redux'
import { selectAllPosts, getPostsStatus, getPostsError } from "./postsSlice"
import PostExcerpt from './PostExcerpt'

const PostList = () => {
    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    let content;
    if (postStatus === 'loading') {
        content = <p>"Loading...."</p>
    } else if (postStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
      <section>
          {content}
      </section>
  )
}

export default PostList