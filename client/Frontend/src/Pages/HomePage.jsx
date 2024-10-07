import React from 'react'
import Structure from '../Components/structure/Structure'
import { useContext } from 'react'
import { useAuth } from '../context/auth'


const HomePage = () => {
  const [auth,setAuth]=useAuth();
  return (
   
    <Structure>
      <h1 className='text-3xl bg-pink-600 text-center'>Home page</h1>
      <pre>{JSON.stringify(auth,null,4)}</pre>
    </Structure>
  )
}

export default HomePage
