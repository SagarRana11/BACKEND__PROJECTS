import React from 'react'
import loginServices from '../services/login'
import BlogServices from '../services/blogs'

const LoginForm = (props) => {
    const {username , password, setUsername , setPassword, user ,setUser} = props
    const handleLogin = async (e)=>{ 
        e.preventDefault()
        console.log('inside handleLogins')
      try{ 
             
            const returnedUser = await loginServices
                .login({username , password})
            console.log(returnedUser)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(returnedUser))
            BlogServices.setToken(returnedUser.token)
            setUser(returnedUser)

            setUsername('')
            setPassword('')  
            // setErrorMessage(`user ${returnedUser.username} logged in`)
            // setTimeout(()=>{
            //    setErrorMessage(null)
            // },5000)
      }catch(exception){
          console.log(exception)
      }

    }
  return (
    <div>
        <h2>Login</h2>
      <form onSubmit={handleLogin}>

        <div>
            username 
               <input name="Username" value={username} onChange={({target})=>setUsername(target.value)} />
        </div>
        <div>
            password 
               <input name="Password" value={password} onChange={({target})=>setPassword(target.value)} />
        </div>

        <button className='loginBtn' type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
