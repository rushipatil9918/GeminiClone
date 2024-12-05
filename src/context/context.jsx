import { createContext,useState } from "react";
import run from "../config/gemini";

export const Context=createContext();


const ContextProvider=({children})=>{

    const[input,setInput]=useState("");//to take input
    const[recentPrompt,setRecentPrompt]=useState("");//to save it in cards
    const[previousPrompt,setPreviousPrompt]=useState([]);//to show all input history
    const[showResult,setShoeResult]=useState(false);//once ite is true it will hide boxes and shoe result
    const[loading,setLoading]=useState(false)//display loading animation
    const[resultData,setResultData]=useState("");//use to display result on our web page


    const delayPara=(index,nextWord)=>{
            setTimeout(function (){
                setResultData(prev=>prev+nextWord);
            },75*index)
    }

    const newChat=()=>{
        setLoading(false);
        setShoeResult(false);

    }

    const onSent=async(prompt)=>{
        setResultData("") //previous response is removed from state variable
        setLoading(true);
        setShoeResult(true)
        let response;
        if(prompt !== undefined){
            response=await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPreviousPrompt(prev=>[...prev,input])
            setRecentPrompt(input);
            response=await run(input)
        }
       
       let responseArray=response.split("**");
       let newResponse="";
       for(let i=0;i<responseArray.length;i++){
        if(i===0 || i%2 !== 1){//even number logic
            newResponse +=responseArray[i];
        }
        else{
            newResponse += "<b>"+responseArray[i]+"</b>";
        }
       }
       let newResponse2=newResponse.split("*").join("</br>")//replace * with new line
       let newResponseArray=newResponse2.split(" ");
       for(let i=0;i<newResponseArray.length;i++){
        const nextWord=newResponseArray[i];
        delayPara(i,nextWord+" ");
       }
       setLoading(false)
       setInput("");
    }

   

    const contextValue={
        previousPrompt,
        setPreviousPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;