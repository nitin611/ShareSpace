import React,{useState,useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Spinner = ({path="signin"}) => {
  // default count 3 sec ka set hai-
    const [count,setCount]=useState(3);
    const navigate=useNavigate();
    const location =useLocation();

    useEffect(()=>{
      const interval=setInterval(() => {
        setCount((prevValue)=>--prevValue)
      }, 1000);
      count===0 && navigate(`/${path}`,{
        state:location.pathname
      });

      return ()=>clearInterval(interval)
},[count,navigate,location,path]);

    return (
        <div className="flex justify-center items-center h-screen">
          <h1 className='text-center'>Redirecting to you in {count} sec</h1>
            <div className="loader"></div>
            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3; 
                    border-top: 8px solid #3498db; 
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
