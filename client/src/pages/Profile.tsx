import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronLeft, ChevronRight, MapPin, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import InterestTag from "@/components/InterestTag";
import ContactForm from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useProfileContext } from "@/ContextApi/contextApi";
import axios from 'axios'
const Profile = () => {
  const { id } = useParams();
  const profileId = parseInt(id);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
   
  // Mock user ID for now (in a real app, this would come from auth)
  const currentUserId = 1;
 const [profile,setProfile] = useState();
 const [ isLoading,setIsLoading] = useState(true);
  // const { data: profiles } = useQuery({
  //   queryKey: ['/api/profiles'],
  // });

  // const { data: profile, isLoading } = useQuery({
  //   queryKey: [`/api/profiles/${profileId}`],
  // });
  const fetchProfileData = async (id)=>{
      console.log("api is calling ");
      try {
      // let query =`?title=${filterData.title}&page=${filterData.page}`; 
      // console.log(filterData.title);
     // const resp =  await callApi("get",`/Profiles${query}`);
      const resp = await axios.get(`http://localhost:5000/api/profiles/${id}`)
      console.log(resp.data)
      setProfile(resp.data.data);
      return resp.data
     
  }catch(e){
  
    console.log(e.message+"Error detecting in Api")
  }
    }


  useEffect( () => {
     if(isLoading)
    { const Userprofile =  fetchProfileData(id)
   //  console.log(Userprofile)
     setIsLoading(false);
    }
   
  }, [isLoading])
  

  // Find the current profile's index in the profiles list
  // const currentIndex = profiles?.findIndex(p => p.id === profileId) || 0;
  // const prevProfileId = currentIndex > 0 ? profiles?.[currentIndex - 1]?.id : null;
  // const nextProfileId = currentIndex < (profiles?.length || 0) - 1 ? profiles?.[currentIndex + 1]?.id : null;

  // const toggleInterest = (interest: string) => {
  //   if (selectedInterests.includes(interest)) {
  //     setSelectedInterests(selectedInterests.filter(i => i !== interest));
  //   } else {
  //     setSelectedInterests([...selectedInterests, interest]);
  //   }first
  // };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative">
          <div className="flex flex-col md:flex-row md:space-x-8 md:items-start bg-white rounded-xl shadow-sm overflow-hidden">
            <Skeleton className="w-full md:w-1/2 lg:w-2/5 h-80 md:h-[600px]" />
            <div className="w-full md:w-1/2 lg:w-3/5 p-6 md:p-8">
              <Skeleton className="h-10 w-2/3 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-6 w-1/3 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-6 w-1/3 mb-3" />
              <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Link href="/browse" className="text-primary hover:underline">Browse other profiles</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="relative">
        {/* Profile Navigation Buttons */}
        {/* <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center pointer-events-none z-10">
          {prevProfileId && (
            <Link href={`/profile/${prevProfileId}`}>
              <button className="profile-nav-button pointer-events-auto ml-2 md:ml-4" aria-label="Previous profile">
                <ChevronLeft className="h-6 w-6" />
              </button>
            </Link>
          )}
          {nextProfileId && (
            <Link href={`/profile/${nextProfileId}`}>
              <button className="profile-nav-button pointer-events-auto mr-2 md:mr-4" aria-label="Next profile">
                <ChevronRight className="h-6 w-6" />
              </button>
            </Link>
          )}
        </div> */}
        
        {/* Profile Content */}
        <div className="flex flex-col md:flex-row md:space-x-8 md:items-start bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Photo Column */}
          <div className="w-full md:w-1/2 lg:w-2/5 h-80 md:h-auto relative">
            <img 
              src={profile.imageUrl} 
              alt={`${profile.displayName}'s profile photo`} 
              className="w-full h-full object-cover grayscale-img" 
            />
            
            {/* Profile ID Badge */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 rounded-lg px-3 py-1 text-sm font-medium shadow-sm">
              {/* ID: {profile.id.toString().padStart(4, '0')} */}
            </div>
          </div>
          
          {/* Profile Info Column */}
          <div className="w-full md:w-1/2 lg:w-3/5 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold">{profile.displayName}, {profile.age}</h1>
              <Badge variant="outline" className="text-xs font-medium bg-primary/10 text-primary px-2 py-1">
                New
              </Badge>
            </div>
            
            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>Divorced ({profile.divorcedYears} years)</span>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mt-6 text-gray-800 space-y-4">
              <p>{profile.bio}</p>
              
              {/* Past History Section */}
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-2">My Journey</h3>
                <p className="text-gray-700">{profile.history}</p>
              </div>
            </div>
            
            {/* Interests Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, index) => (
                  <InterestTag 
                    key={index} 
                    name={interest} 
                    selected={selectedInterests.includes(interest)} 
                    onClick={() => toggleInterest(interest)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Contact Section */}
            <ContactForm 
              profileId={profile.id} 
              toUserId={profile.userId} 
              fromUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
