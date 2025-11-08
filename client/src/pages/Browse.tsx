import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useProfileContext } from "@/ContextApi/contextApi";
import { ArrowLeft, ArrowRight,Loader2 } from 'lucide-react';
const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(8);
  
  const {ProfileData }= useProfileContext(); 
  console.log(ProfileData)
  //   const [profiles,setProfiles] = useState([]);
  // const ProfileData=async()=>{
  //   const Data = await axios.get('http://localhost:5000/api/profiles')
  //   //const response =  await callApi('get','/profiles');
  // // console.log(response);
  //   console.log('API Response:', Data.data);
  //   setProfiles(Data.data)
  // }
  
  
  // const { data: profiles, isLoading } = useQuery({
  //   queryKey: ['/api/profiles'],
  // });
  
  // const { data: interests } = useQuery({
  //   queryKey: ['/api/interests'],
  // });
  
  // Filter profiles based on search term and selected interests
  // const filteredProfiles = profiles?.filter(profile => {
  //   const matchesSearch = searchTerm === "" || 
  //     profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   const matchesInterests = selectedInterests.length === 0 || 
  //     selectedInterests.some(interest => profile.interests.includes(interest));
    
  //   return matchesSearch && matchesInterests;
  // });
  
  // const toggleInterest = (interest: string) => {
  //   if (selectedInterests.includes(interest)) {
  //     setSelectedInterests(selectedInterests.filter(i => i !== interest));
  //   } else {
  //     setSelectedInterests([...selectedInterests, interest]);
  //   }
  // };
  
  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 8);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Profiles</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
        <div className="flex items-center mb-4">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        
        {/* {interests && interests.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Filter by interests:</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        )}
      </div> */}
      
      {/* Profiles Grid */}
      {

        !ProfileData ?
        <> <div className="flex items-center justify-center h-screen text-gray-500">
           
 <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
        
      </div></>:
<>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/*   {isLoading && (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))
        )}
         */}
        { ProfileData && ProfileData.slice(0, displayLimit).map((profile) => (
          <ProfileCard key={profile._id} id ={profile._id} profile={profile.data} />
        ))}
      </div>
</>

      }
    
      
      {/* No Results Message */}
      {/* {filteredProfiles && filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
       */}
      {/* Load More Button */}
      {/* {filteredProfiles && filteredProfiles.length > displayLimit && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="px-6"
          >
            Load More
          </Button>
        </div>
      )} */}
   
    </div>
     </div>
  );
};

export default Browse;
