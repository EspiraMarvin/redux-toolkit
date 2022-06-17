import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { postAdded } from "./postsSlice"
import { nanoid } from "@reduxjs/toolkit"

const AddPostForm = () => {
  const isMounted = useRef()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
        dispatch(
          postAdded({
            id: nanoid(),
            title,
            content
          })
      )
      setTitle('')
      setContent('')
    }
  }

  useEffect(() => {
    if (isMounted.current)  return 
        isMounted.current = true
        console.log('ADDPOSTFORM run')
  }, [])

  return (
    <section>
        <h2>Add a New Post</h2>
        <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                >Save Post</button>
            </form>
    </section>
  )
}

export default AddPostForm