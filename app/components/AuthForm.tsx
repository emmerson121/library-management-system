// "use client";

// import { FormEvent, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// interface AuthFormProps {
//   mode: "login" | "signup";
// }

// export default function AuthForm({ mode }: AuthFormProps) {
//   const router = useRouter();

//   const isSignup = mode === "signup";

//   const [title, setTitle] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     // Basic validation
//     if (isSignup && !title.trim()) {
//       setError("Please enter your full name.");
//       return;
//     }

//     if (!email.trim()) {
//       setError("Please enter your email address.");
//       return;
//     }

//     if (!password) {
//       setError("Please enter your password.");
//       return;
//     }

//     if (isSignup && password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const endpoint = isSignup
//         ? "/api/auth/signup"
//         : "/api/auth/login";

//       const body = isSignup
//         ? {
//             title: title.trim(),
//             email: email.trim().toLowerCase(),
//             password,
//             role: "student",
//           }
//         : {
//             email: email.trim().toLowerCase(),
//             password,
//           };

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.message ||
//             data?.error ||
//             (isSignup
//               ? "Unable to create your account."
//               : "Unable to log in.")
//         );
//       }

//       /*
//        * LOGIN
//        *
//        * Your backend returns:
//        * data.token
//        * data.user
//        */
//       if (!isSignup) {
//         if (data?.data?.token) {
//           localStorage.setItem("token", data.data.token);
//         }

//         if (data?.data?.user) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify(data.data.user)
//           );
//         }

//         setSuccess("Login successful. Redirecting...");

//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 800);

//         return;
//       }

//       /*
//        * SIGNUP
//        *
//        * After successful registration, send the user
//        * to the login page.
//        */
//       setSuccess(
//         data?.message ||
//           "Account created successfully. Please log in."
//       );

//       setTitle("");
//       setEmail("");
//       setPassword("");

//       setTimeout(() => {
//         router.push("/login");
//       }, 1200);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
//         <div className="grid min-h-[600px] md:grid-cols-2">
          
//           {/* LEFT SIDE */}
//           <div className="hidden md:flex bg-[#0093cde3] text-white p-10 lg:p-14 flex-col justify-between">
//             <div>
//               <div className="mb-10">
//                 <h1 className="text-3xl font-bold">
//                   Meridian University
//                 </h1>

//                 <p className="mt-2 text-white/80">
//                   Library Management System
//                 </p>
//               </div>

//               <div className="max-w-md">
//                 <h2 className="text-4xl font-bold leading-tight">
//                   {isSignup
//                     ? "Create your library account."
//                     : "Welcome back to your library."}
//                 </h2>

//                 <p className="mt-5 text-white/85 leading-7">
//                   {isSignup
//                     ? "Create your student account and get access to books, borrowing and returning services."
//                     : "Sign in to manage your borrowed books and access the Meridian University Library."}
//                 </p>
//               </div>
//             </div>

//             <div className="text-sm text-white/70">
//               <p>
//                 © {new Date().getFullYear()} Meridian University
//               </p>
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
//             <div className="w-full max-w-md">
              
//               {/* Mobile heading */}
//               <div className="mb-8 md:hidden">
//                 <h1 className="text-2xl font-bold text-[#0093cde3]">
//                   Meridian University
//                 </h1>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Library Management System
//                 </p>
//               </div>

//               {/* Form heading */}
//               <div className="mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   {isSignup ? "Create Account" : "Welcome Back"}
//                 </h2>

//                 <p className="mt-2 text-sm text-gray-500">
//                   {isSignup
//                     ? "Fill in your details to create your student account."
//                     : "Enter your details to access your account."}
//                 </p>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//                   {error}
//                 </div>
//               )}

//               {/* Success */}
//               {success && (
//                 <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
//                   {success}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
                
//                 {/* Full name - signup only */}
//                 {isSignup && (
//                   <div>
//                     <label
//                       htmlFor="title"
//                       className="mb-2 block text-sm font-medium text-gray-700"
//                     >
//                       Full Name
//                     </label>

//                     <input
//                       id="title"
//                       type="text"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       placeholder="Enter your full name"
//                       disabled={loading}
//                       autoComplete="name"
//                       className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0093cde3] focus:ring-2 focus:ring-[#0093cde3]/20 disabled:bg-gray-100"
//                     />
//                   </div>
//                 )}

//                 {/* Email */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="mb-2 block text-sm font-medium text-gray-700"
//                   >
//                     Email Address
//                   </label>

//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     disabled={loading}
//                     autoComplete="email"
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0093cde3] focus:ring-2 focus:ring-[#0093cde3]/20 disabled:bg-gray-100"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="mb-2 block text-sm font-medium text-gray-700"
//                   >
//                     Password
//                   </label>

//                   <div className="relative">
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Enter your password"
//                       disabled={loading}
//                       autoComplete={
//                         isSignup
//                           ? "new-password"
//                           : "current-password"
//                       }
//                       className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0093cde3] focus:ring-2 focus:ring-[#0093cde3]/20 disabled:bg-gray-100"
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword((prev) => !prev)
//                       }
//                       disabled={loading}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0093cde3]"
//                       aria-label={
//                         showPassword
//                           ? "Hide password"
//                           : "Show password"
//                       }
//                     >
//                       {showPassword ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M3.98 8.75C2.69 10.16 2 12 2 12s3.5 7 10 7c2.1 0 3.84-.65 5.25-1.57M6.1 6.1C7.7 5.1 9.7 4 12 4c6.5 0 10 7 10 7s-.69 1.84-1.98 3.25M3 3l18 18"
//                           />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
//                           />
//                           <circle
//                             cx="12"
//                             cy="12"
//                             r="3"
//                           />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Role - signup only */}
//                 {isSignup && (
//                   <div>
//                     <label
//                       htmlFor="role"
//                       className="mb-2 block text-sm font-medium text-gray-700"
//                     >
//                       Account Type
//                     </label>

//                     <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
//                       <span className="text-sm text-gray-700">
//                         Student
//                       </span>

//                       <span className="rounded-full bg-[#0093cde3]/10 px-3 py-1 text-xs font-medium text-[#0093cde3]">
//                         Default
//                       </span>
//                     </div>

//                     {/* 
//                       No input is provided here intentionally.
//                       The role is sent directly as:
//                       role: "student"
//                     */}
//                   </div>
//                 )}

//                 {/* Forgot password */}
//                 {!isSignup && (
//                   <div className="flex justify-end">
//                     <Link
//                       href="/forgot-password"
//                       className="text-sm font-medium text-[#0093cde3] hover:underline"
//                     >
//                       Forgot Password?
//                     </Link>
//                   </div>
//                 )}

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full rounded-lg bg-[#0093cde3] px-4 py-3 font-semibold text-white transition hover:bg-[#007fb3] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {loading
//                     ? isSignup
//                       ? "Creating Account..."
//                       : "Logging In..."
//                     : isSignup
//                     ? "Create Account"
//                     : "Login"}
//                 </button>
//               </form>

//               {/* Switch auth mode */}
//               <div className="mt-7 text-center text-sm text-gray-500">
//                 {isSignup ? (
//                   <>
//                     Already have an account?{" "}
//                     <Link
//                       href="/login"
//                       className="font-semibold text-[#0093cde3] hover:underline"
//                     >
//                       Login
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     Don't have an account?{" "}
//                     <Link
//                       href="/signup"
//                       className="font-semibold text-[#0093cde3] hover:underline"
//                     >
//                       Create one
//                     </Link>
//                   </>
//                 )}
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }