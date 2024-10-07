import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const Spinner = () => {
    const [count,setCount]=useState(5);
    const navigate=useNavigate()

    useEffect(()=>{
      const interval=setInterval(() => {
        setCount((prevValue)=>--prevValue)
      }, 1000);
      count===0 && navigate('/signin');

      return ()=>clearInterval(interval)
},[count,navigate,])

    return (
        <div className="flex justify-center items-center h-screen">
          <h1 className='text-center'>Redirecting to you in {count} sec</h1>
            <div className="loader"></div>
            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3; /* Light gray */
                    border-top: 8px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Spinner;
