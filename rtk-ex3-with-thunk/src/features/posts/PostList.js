import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from "./postsSlice"
import { useEffect, useRef } from 'react'
import PostExcerpt from './PostExcerpt'


const PostList = () => {
    let isMounted = useRef()
    const dispatch = useDispatch()
    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    useEffect(() => {
        console.log('Postlist rendered')
        if (isMounted.current)  return 
        isMounted.current = true

      if (postStatus === 'idle') {
          dispatch(fetchPosts())
      }
    }, [postStatus, dispatch])

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
          <h2>Posts</h2>
          {content}
      </section>
  )
}

export default PostList