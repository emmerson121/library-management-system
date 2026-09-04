// "use client"

// import { ChangeEvent, useState } from "react";
// import validator from 'validator'

// interface FormData1{
//     email: string,
//     password: string,
// }

// export default function LoginPage() {
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState<FormData1>({
//         email: '',
//         password: '',
//     });
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [errorMessage, setErrorMessage] = useState('')
//     const [success, setSuccess] = useState<null | string>('')

//     const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//         const {name, value} = e.target

//         const newForm = {
//         ...formData,
//         [name]: value,
//     };

//     setFormData(newForm);

//         // setFormData((prevData) => ({
//         //     ...prevData,
//         //     [name]: value,
//         // }))

//         // setFormData(formData)

//         let errorMessage2 = '';
//         let errorMessage3 = '';

//         if(name === 'email'){
//             if(value.trim() === ''){
//                 errorMessage2 = 'Email is required'
//             } else if(!validator.isEmail(value)){
//                 errorMessage2 = 'Invalid email address'
//             }
//             setEmailError(errorMessage2);
//         }

//         if(name === 'password1'){
//             if(value.trim() === ''){
//                 errorMessage3 = 'Password field is required'
//             } else if(value.length < 6){
//                 errorMessage3 = 'Password must not be less than 6 characters';
//             }
//             setPasswordError(errorMessage3)
//         }
//     }

//     const submitButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
    
//         const { email, password } = formData;
    
//         try{
//             if( !email || !password ){
//                 setErrorMessage('All fields are required');
//                 setTimeout(() => setErrorMessage(''), 3000);
//                 return;
//             }
    
//             if(!validator.isEmail(email)){
//                 setErrorMessage('Invalid email address');
//                 setTimeout(() => setErrorMessage(''), 3000);
//                 return;
//             }
    
//             if(password.length < 6){
//                 setErrorMessage('Password must not be less than 6 characters');
//                 setTimeout(() => setErrorMessage(''), 3000);
//                 return;
//             }
    
//         }catch(error){
//             console.error(error);
//             setSuccess('Something went wrong. Please try again later.');
//         }
//     }

//     return(
//         <div>
//              <div className="text-2xl text-[#0093cde3] text-center mt-4 font-bold">DexaLib Management System</div>
        
//         <div className="form1">
//             <h1 className="text-black text-3xl font-bold mb-2 text-center">Login Page</h1>
//             <form action="" className="formlist" >
//                 <div><input className="inputStyle" name="email" type="text" value={formData.email} placeholder="Email address" onChange={onChangeHandler} /></div>
//                 {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

//                 <div className="password-wrapper">
//                     <input className="inputStyle" name="password1" type={showPassword ? "text" : "password"} value={formData.password} onChange={onChangeHandler} placeholder="Password" />
                   
//                     <button type="button" className="toggle-password" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
//                         {showPassword ? 
//                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                  <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>   
//                     </svg> 
//                     :
//                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                    <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path>  
//                      </svg> 
                    
//                         }
//                         {/* {showPassword ? 'Hide' : 'Show'} */}
//                     </button>
//                 </div>
//                 {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}


//                  <div className="text-[#0093cde3] text-base mt-2 mb-2">Forgot Password?</div>
//                 <button className="but" type="submit" onClick={submitButton}>Login</button>
//                 {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}

//                 <div className="text-black text-base mt-2">Don't have an account? <a href=""><span className="text-[#0093cde3] text-base font-bold">Sign Up</span></a></div>
//             </form>
//         </div>
//     </div>
//     );
// }
