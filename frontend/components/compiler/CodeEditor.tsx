// import React, { useEffect, useState } from "react";
// import CodeEditorWindow from "./CodeEditorWindows";
// import axios from "axios";
// import { classnames } from "./utils/general";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { defineTheme } from "./utils/defineTheme";
// import useKeyPress from "./utils/useKeyPress";
// import OutputWindow from "./OutputWindow";
// import OutputDetails from "./OutputDetails";
// import ThemeDropdown from "./SelectDropdown";



// const CodeEditor = () => { 
// const [code, setCode] = useState('#Write Your R Code Here');
// const [customInput, setCustomInput] = useState("");
// const [outputDetails, setOutputDetails] = useState('');
// const [processing, setProcessing] = useState(null);
// const [theme, setTheme] = useState("amy");
// const language = {
//     id: 80,
//     name: "R (4.0.0)",
//     label: "R (4.0.0)",
//     value: "r",
// }
//   const [response, setResponse] = useState('');
//   const API_HOST = 'https://rest-api-zzvthujxxq-as.a.run.app'; // Ganti dengan host Anda jika berbeda
//   const API_PORT = 5000;

// const enterPress = useKeyPress("Enter");
// const ctrlPress = useKeyPress("Control");

// useEffect(() => {
//     if (enterPress && ctrlPress) {
//     console.log("enterPress", enterPress);
//     console.log("ctrlPress", ctrlPress);
//     handleCompile();
//     }
// }, [ctrlPress, enterPress]);

// const onChange = (action: any, data: string) => {
//     switch (action) {
//     case "code": {
//         setCode(data);
//         break;
//     }
//     default: {
//         console.warn("case not handled!", action, data);
//     }
//     }
// };

// const handleCompile = async () => {
//     try {
//         const response = await fetch(`${API_HOST}:${API_PORT}/api/compiler`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ code }),
//         });
  
//         const data = await response.text();
//         setOutputDetails(data);
//         setResponse(data);
//         console.log(data);
//       } catch (error) {
//         console.error(error);
//         setResponse('Terjadi kesalahan saat mengirim kode.');
//       }
// };

// // const checkStatus = async (token) => {
// //     const options = {
// //     method: "GET",
// //     url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
// //     params: { base64_encoded: "true", fields: "*" },
// //     headers: {
// //         "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
// //         "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
// //     },
// //     };
// //     try {
// //     let response = await axios.request(options);
// //     let statusId = response.data.status?.id;

// //     // Processed - we have a result
// //     if (statusId === 1 || statusId === 2) {
// //         // still processing
// //         setTimeout(() => {
// //         checkStatus(token);
// //         }, 2000);
// //         return;
// //     } else {
// //         setProcessing(false);
// //         setOutputDetails(response.data);
// //         // showSuccessToast(`Compiled Successfully!`);
// //         console.log("response.data", response.data);
// //         return;
// //     }
// //     } catch (err) {
// //     console.log("err", err);
// //     setProcessing(false);
// //     // showErrorToast();
// //     }
// // };

// function handleThemeChange(th: any) {
//     const theme = th;
//     console.log("theme...", theme);

//     if (["vs-dark", "vs-dark"].includes(theme.value)) {
//     setTheme(theme);
//     } else {
//     defineTheme(theme.value).then((_) => setTheme(theme));
//     }
// }
// // useEffect(() => {
// //     defineTheme("monoindustrial").then((_) =>
// //     setTheme({ value: "monoindustrial", label: "monoindustrial" })
// //     );
// // }, []);

// // const showSuccessToast = (msg) => {
// //     toast.success(msg || `Compiled Successfully!`, {
// //     position: "top-right",
// //     autoClose: 1000,
// //     hideProgressBar: false,
// //     closeOnClick: true,
// //     pauseOnHover: true,
// //     draggable: true,
// //     progress: undefined,
// //     });
// // };
// // const showErrorToast = (msg, timer) => {
// //     toast.error(msg || `Something went wrong! Please try again.`, {
// //     position: "bottom-right",
// //     autoClose: timer ? timer : 1000,
// //     hideProgressBar: false,
// //     closeOnClick: true,
// //     pauseOnHover: true,
// //     draggable: true,
// //     progress: undefined,
// //     });
// // };

// return (
//     <>
//     <ToastContainer
//         position="bottom-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//     />



//     <div className=" items-start">
//         <div className=" pb-4 items-end grid grid-cols-2 md:grid-cols-5 gap-4 ">
//             <div className="md:col-span-2 md:col-start-3">
//             <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
//             </div>
//             <button
//             onClick={handleCompile}
//             disabled={!code}
//             value={code}
//             className={classnames(
//                 "block w-full bg-[#00726B] mt-5 py-2 rounded-lg duration-500 text-white font-semibold md:col-span-1",
//                 !code ? "opacity-50" : ""
//             )}
//             >
//             {processing ? "Processing..." : "Compile"}
//             </button>
            
//         </div>
//         <div className=" w-full h-full justify-start items-end">
//         <CodeEditorWindow
//             code={code}
            
//             onChange={onChange}
//             language={language?.value}
//             theme={theme}
//         />
//         </div>

//         <div className="  flex flex-shrink-0 w-full  flex-col">
//             <div className="px-4 py-2">
//             <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
//                 Output
//             </h1>
//             </div>
//         {/* <OutputWindow outputDetails={outputDetails} /> */}
//         <div className="w-full h-56 bg-[#1e293b] text-green-500 font-normal text-sm overflow-y-auto">
//             <pre className="p-5">{response}</pre>
//         </div>
//         <div className="flex flex-col items-end">
//         </div>
        
//         </div>
//     </div>
//     </>
// );
// };
// export default CodeEditor;
