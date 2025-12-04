import { createContext, useContext, useEffect, useState } from "react";
 

const ProfileContext = createContext();
import axios from 'axios'
export const ProfileProvider = ({ children}) => {
  const [ProfileData, setProfileData] = useState([]);
  const [filterData,setFilterData] = useState({title:"",page:""});
  const [profile,setProfile] = useState();
   useEffect(() => {
     fetchData()
   
     
   }, [])
   
 const fetchData = async ()=>{
    console.log("api is calling ");
    try {
    // let query =`?title=${filterData.title}&page=${filterData.page}`; 
    // console.log(filterData.title);
   // const resp =  await callApi("get",`/Profiles${query}`);
    const resp = await axios.get('https://heydivo.com/api/profiles')
    console.log(resp.data)
    setProfileData(resp.data);
    console.log(ProfileData)
   
}catch(e){

  console.log(e.message+"Error detecting in Api")
}
  }

const fetchProfileData = async (id)=>{
    console.log("api is calling ");
    try {
    // let query =`?title=${filterData.title}&page=${filterData.page}`; 
    // console.log(filterData.title);
   // const resp =  await callApi("get",`/Profiles${query}`);
    const resp = await axios.get(`https://heydivo.com/api/profiles/${id}`)
    console.log(resp.data)
    setProfile(resp.data);
    return resp.data
   
}catch(e){

  console.log(e.message+"Error detecting in Api")
}
  }






  return (
    <ProfileContext.Provider value={{ fetchProfileData,ProfileData, setProfileData,filterData,setFilterData,fetchData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
