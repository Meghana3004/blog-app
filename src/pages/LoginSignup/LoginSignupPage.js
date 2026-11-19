import React from 'react';
import './LoginSignupPage.css';
import { useLoginSignup } from '../../hooks/useLoginSignup';
import LoginForm from '../../components/FormComponent/LoginForm';
import SignupForm from '../../components/FormComponent/SignupForm';

function LoginSignupPage() {
  const {
    errorMsg,
    successMsg,
    isLogin,
    toggleForm,
    handleSubmit,
  } = useLoginSignup();

  return (
    <div className="main-login">
      <div className="container">
        <h1 className="text-center mb-4 header">Infinite Horizons</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <a className={`nav-link ${isLogin ? 'active' : ''}`} href="#login" onClick={toggleForm}>Login</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${!isLogin ? 'active' : ''}`} href="#signup" onClick={toggleForm}>Sign Up</a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
                {successMsg && <div className="alert alert-success" role="alert">{successMsg}</div>}
                
                {isLogin ? <LoginForm onSubmit={handleSubmit} /> : <SignupForm onSubmit={handleSubmit} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './LoginSignupPage.css';
// import axios from 'axios';

// function LoginSignupPage() {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const logout = queryParams.get('logout');

//     const [errorMsg, setErrorMsg] = useState('');
//     const [successMsg, setSuccessMsg] = useState('');
//     const [isLogin, setIsLogin] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (logout) {
//         sessionStorage.removeItem('username');
//         setSuccessMsg('Successfully logged out.');
//         setErrorMsg('');
//       }
//     }, [logout]);

//     function toggleForm() {
//         setErrorMsg('');
//         setSuccessMsg('');
//         setIsLogin(prevState => !prevState);
//     }
    
//     const handleSubmit = async(e)=> {
//         e.preventDefault();
//         setErrorMsg('');
//         if (isLogin) {
//             const email = e.target.elements.logEmail.value;
//             const data = {
//                 email
//             }

//             try{
//             const response = await axios.post('/users/login', data);
//                 setSuccessMsg('Successfully logged in');
//                 sessionStorage.setItem('username', response.data.username)
//                 navigate('/Home');
//             } catch(error){
//                 setErrorMsg(error.response.data.message);
//             }
            
//             } else {
//             const name = e.target.elements.name.value;
//             const email = e.target.elements.email.value;
//             const username = e.target.elements.username.value;
//             const dob = e.target.elements.dob.value;
//             const mobile = e.target.elements.mobile.value;
//             const mobilePattern = /^\d{10}$/;

//             if (!name || !email || !username || !dob || !mobile) {
//                 setErrorMsg("Please fill all the required fields");
//                 return;
//             }
//             else if (!mobilePattern.test(mobile)){
//                 setErrorMsg('Enter valid mobile number');
//                 return;
//             }
//             const formData = {
//                 name,email,username,dob,mobile
//             };

//             try{
//               await axios.post('/users/signup', formData);           
//               setSuccessMsg('Successfully signed up');              
//               setErrorMsg('');
                
//             } catch(error){
//               setErrorMsg('Error signing up. Please try again');
//             }
//         }
//     };


//     return (
//         <div className = "main-login">
//         <div className="container">
//             <h1 className="text-center mb-4 header">Infinite Horizons</h1>
//             <div className="row justify-content-center">
//                 <div className="col-md-6 ">
//                     <div className="card ">
//                         <div className="card-header">
//                             <ul className="nav nav-tabs card-header-tabs">
//                                 <li className="nav-item">
//                                     <a className={`nav-link ${isLogin ? 'active' : ''}`} href="#login" onClick={toggleForm}>Login</a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a className={`nav-link ${!isLogin ? 'active' : ''}`} href="#signup" onClick={toggleForm}>Sign Up</a>
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className="card-body">
//                             {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
//                             {successMsg && <div className="alert alert-success" role="alert">{successMsg}</div>}
                            
//                             <form onSubmit={handleSubmit}>
//                                 {isLogin ? (
//                                     <>
//                                         <div className="mb-3">
//                                             <input type="email" className="form-control control" id="logEmail" placeholder="Email..." />
//                                         </div>
//                                         <button type="submit" className="btn btn-green text-white-75">Login</button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <div className="mb-3">
//                                             <input type="text" className="form-control control" id="name" placeholder="Enter your name" required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <input type="email" className="form-control control" id="email" placeholder="Enter your email" required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <input type="text" className="form-control control" id="username" placeholder="Enter your username" required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <label htmlFor="dob" className="form-label">Date of Birth:</label>
//                                             <input type="date" className="form-control control" id="dob" required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <input type="text" className="form-control control" id="mobile" placeholder="Enter your Mobile Number" required maxLength="10" />
//                                         </div>
//                                         <button type="submit" className="btn btn-green text-white-75">Sign Up</button>
//                                     </>
//                                 )}
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </div>
//     );
// }

// export default LoginSignupPage;



