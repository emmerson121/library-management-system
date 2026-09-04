// "use client"

// import { ChangeEvent, useState } from "react";
// import validator from 'validator'

// interface Formdata{
//     title: string,
//     email: string,
//     password: string,
//     role: string[]
// }

// export default function CreateAccountPage() {
// const [formData, setFormData] = useState<Formdata>({
//     title: '', 
//     email: '', 
//     password: '', 
//     role: ['student', 'author', 'libraryAttendant'],
// });
// const [updatedFormData, setUpdatedFormData] = useState<Formdata>({
//     title: '', 
//     email: '', 
//     password: '', 
//     role: ['student', 'author', 'libraryAttendant'],
// });
// const [showPassword, setShowPassword] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [titleError, setTitleError] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [role, setRole] = useState('student');
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [success, setSuccess] = useState<null | string>('');

// const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // setFormData((prevData) => ({
//     //         ...prevData,
//     //         [name]: value,
//     //     }));

//     const newForm = {
//         ...formData,
//         [name]: value,
//     };

//     setFormData(newForm);
//     // setUpdatedFormData(newForm);

//     let errorMessage1 = '';
//     let errorMessage2 = '';
//     let errorMessage3 = '';
//     let errorMessage4 = '';

//     if(name === 'title'){
//         if(value.trim() === ''){
//             errorMessage1 = 'Title field is required'
//         } else if(value.length <= 5 ){
//             errorMessage1 = 'Name must not be less than 6 characters';
//         }
//         setTitleError(errorMessage1);
//     }

//     if(name === 'email'){
//         if(value.trim() === ''){
//             errorMessage2 = 'Email field is required';
//         } else if(!validator.isEmail(value)){
//             errorMessage2 = 'Invalid email address';
//         }
//         setEmailError(errorMessage2);
//     }

//     if(name === 'password'){
//         if(value.trim() === ''){
//             errorMessage3 = 'Password field is required';
//         } else if(value.length <= 5){
//             errorMessage3 = 'Password must not be less than 6 characters'
//         }
//         setPasswordError(errorMessage3);
//     }

//     // if(name === 'password2'){
//     //     if(value.trim() === ''){
//     //         errorMessage4 = 'This field cannot be empty';
//     //     } else if(value !== newForm.password1){
//     //         errorMessage4 = 'Password mismatch. Please confirm your password'
//     //     }
//     //     setConfirmPasswordError(errorMessage4);
//     // }
// }

// const submitButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();

//     const { title, email, password, role } = formData;

//     try{
//         if( !title || !email || !password || !role ){
//             setErrorMessage('All fields are required');
//             setTimeout(() => setErrorMessage(''), 3000);
//             return;
//         }

//         if(!validator.isEmail(email)){
//             setErrorMessage('Invalid email address');
//             setTimeout(() => setErrorMessage(''), 3000);
//             return;
//         }

//         if(password.length < 6){
//             setErrorMessage('Password must not be less than 6 characters');
//             setTimeout(() => setErrorMessage(''), 3000);
//             return;
//         }

//         // if(password1 !== password2){
//         //     setErrorMessage('Password mismatch!');
//         //     setTimeout(() => setErrorMessage(''), 3000);
//         //     return;
//         // }

//     }catch(error){
//         console.error(error);
//         setSuccess('Something went wrong. Please try again later.');
//     }
// }

//     return(
//         <div>
//             <div className="text-2xl text-[#0093cde3] text-center mt-4 font-bold">DexaLib Management System</div>
        
//         <div className="form2">
//             <h1 className="text-black text-3xl font-bold mb-2 text-center">Create account</h1>
//             <form action="" className="formlist2" >
//                 <div><input name="name" className="inputStyle" type="text" value={formData.title} onChange={onChangeHandler} placeholder="Title" /></div>
//                 {titleError && <p className="text-red-500 text-sm mb-2">{titleError}</p>}
                
//                 <div><input name="email" className="inputStyle" type="email" value={formData.email} onChange={onChangeHandler} placeholder="Email address" /></div>
//                 {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
                
//                 <div className="password-wrapper">
//                     <input name="password1" className="inputStyle" type={showPassword ? "text" : "password"} value={formData.password} onChange={onChangeHandler} placeholder="Password" />
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
//                     </button>
//                 </div>
//                 {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

//             <div className="flex items-center gap-2 mt-[15px] mb-[10px]">
//                 <p className="text-black text-base">Role:</p>
//                 <select name="Role:" id="" className="text-black border-1 border-[#707070] h-8 rounded-md">
//                     <option value="">Student</option>
//                     <option value="">Author</option>
//                     <option value="">Library Attendant</option>
//                 </select>
//             </div>
//                 {/* <div className="password-wrapper">
//                     <input name="password2" className="inputStyle" type={showConfirm ? "text" : "password"} value={formData.password2} onChange={onChangeHandler} placeholder="Confirm Password" />

//                     <button type="button" className="toggle-password" onClick={() => setShowConfirm(s => !s)} aria-label={showConfirm ? "Hide password" : "Show password"}>
//                         {showConfirm ? 
//                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                  <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0_25.31_3.79_47.85_47.85_0_0_1_-66.9_66.9A95.78_95.78_0_1_0_288_160z"></path>   
//                     </svg> 
//                     :
//                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                    <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path>  
//                      </svg>
//                         }
//                     </button>
//                 </div> */}
                

//                 <button className="but" type="submit" onClick={submitButton}>Create Account</button>
//                 {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
//                 {/* {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>} */}

//                 <div className="flex items-center gap-2 mt-2">
//             <div className="text-black text-base">Already have an account?</div> 
//             <a href=""><div className="text-[#0093cde3] text-base font-bold">Login here</div></a>
//         </div>
//             </form>   

            
//             </div>
//         </div>
//     );
// }
