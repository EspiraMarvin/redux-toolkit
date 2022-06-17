import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectAllPosts } from "./postsSlice"

const PostList = () => {
    const isMounted = useRef()
    
    const posts = useSelector(selectAllPosts)

    posts.map(post => {
console.log('post', post)
return post
    })

    const renderedPosts = posts.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
        </article>
    ))

    useEffect(() => {
        if (isMounted.current)  return 
        isMounted.current = true
        console.log('POSTLIST run')
    }, [])

  return (
      <section>
          <h2>Posts</h2>
          {renderedPosts}
      </section>
  )
}

export default PostList