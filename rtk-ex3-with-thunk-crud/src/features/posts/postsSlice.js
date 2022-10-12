import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { sub } from 'date-fns'
import axios from 'axios'

const POSTS_URL = 'http://jsonplaceholder.typicode.com/posts'

const initialState =  {
    posts: [],
    status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POSTS_URL)
        return response.data.slice(0, 9)
    }
     catch(err) {
        return err.message
    }
})

export const addNewPost = createAsyncThunk('post/addNewPost', async (initialPost) => {
    try{
        const response = await axios.post(POSTS_URL, initialPost)
        return response.data
    } catch(err) {
        return err.message
    } 
})

export const updatePost = createAsyncThunk('post/updatePost', async (initialPost) => {
    const { id } = initialPost
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch(err) {
        // return err.message
        return initialPost   // for redux tests only, since the fake api doesnt update a newly created post as it doesnt exist
    }
})

export const deletePost = createAsyncThunk('post/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPost
        return `${response?.status} : ${response.statusText}`
    } catch(err) {
        return err.message
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer:(state, action) => {
                // console.log('store payload', action.payload)
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                } 
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
                state.status = 'succeeded'
                // adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
         })
                // add any fetched post to the array
                state.posts = state.posts.concat(loadedPosts)
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'rejected'
            state.error = action.error.message
        },
        [addNewPost.fulfilled]: (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
              //             wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                // console.log(action.payload)
                state.posts.push(action.payload)
        },
        [updatePost.fulfilled]: (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload];
        },
        [deletePost.fulfilled]: (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts;
        },

        // builder
        //     .addCase(fetchPosts.pending, (state, action) => {
                // state.status = 'loading'
        //     })
        //     .addCase(fetchPosts.fulfilled, (state, action) => {
        //         state.status = 'succeeded'
        //         // adding date and reactions
        //         let min = 1;
        //         const loadedPosts = action.payload.map(post => {
        //             post.date = sub(new Date(), { minutes: min++ }).toISOString();
        //             post.reactions = {
        //                 thumbsUp: 0,
        //                 wow: 0,
        //                 heart: 0,
        //                 rocket: 0,
        //                 coffee: 0
        //             }
        //             return post
        //  })
        //         // add any fetched post to the array
        //         state.posts = state.posts.concat(loadedPosts)
        //     })
        //     .addCase(fetchPosts.rejected, (state, action) => {
        //         state.status = 'failed'
        //         state.error = action.error.message
        //     })
            // .addCase(addNewPost.fulfilled, (state, action) => {
            //     action.payload.userId = Number(action.payload.userId)
            //     action.payload.date = new Date().toISOString()
            //     action.payload.reactions = {
            //         thumbsUp: 0,
            //   //             wow: 0,
            //         heart: 0,
            //         rocket: 0,
            //         coffee: 0
            //     }
            //     // console.log(action.payload)
            //     state.posts.push(action.payload)
            // })
            // .addCase(updatePost.fulfilled, (state, action) => {
            //     if (!action.payload?.id) {
            //         console.log('Update could not complete')
            //         console.log(action.payload)
            //         return;
            //     }
            //     const { id } = action.payload;
            //     action.payload.date = new Date().toISOString();
            //     const posts = state.posts.filter(post => post.id !== id);
            //     state.posts = [...posts, action.payload];
            // })
            // .addCase(deletePost.fulfilled, (state, action) => {
            //     if (!action.payload?.id) {
            //         console.log('Delete could not complete')
            //         console.log(action.payload)
            //         return;
            //     }
            //     const { id } = action.payload;
            //     const posts = state.posts.filter(post => post.id !== id);
            //     state.posts = posts;
            // })
    }
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

// select post by id
export const selectPostById = (state, postId) =>
     state.posts.posts.find(post => post.id === postId)


export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer