import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Mail, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { callApi } from "@/lib/utils";
import VerifyBadge from "@/components/ui/verifyBedge";

const MyProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile,setProfile] = useState();
  // Mock user ID (in a real app, this would come from auth)

  const currentUserId = 1;
const [ isVerify,setIsVerify] = useState();
const response =async () =>{ 
  
   const data =  await callApi('get','/myprofiles');
        console.log("profile Data",data);

        setProfile(data.data);
        setIsVerify(data.isVerify);
}
  useEffect(()=>{
       response();
  },[])
  // Get the current user's profile
  // const { data: profile, isLoading: profileLoading } = useQuery({
  //   queryKey: ['/api/profiles'],
  //   select: (profiles) => profiles?.find(p => p.userId === currentUserId)
  // });
  
  // Get contact requests for the current user
  // const { data: contactRequests, isLoading: requestsLoading } = useQuery({
  //   queryKey: [`/api/contact-requests/user/${currentUserId}`],
  //   enabled: !!currentUserId
  // });
  
  // Get matches for the current user
  // const { data: matches, isLoading: matchesLoading } = useQuery({
  //   queryKey: [`/api/matches/user/${currentUserId}`],
  //   enabled: !!currentUserId
  // });
  
  // Handle contact request response (accept/reject)
  // const contactRequestMutation = useMutation({
  //   mutationFn: async ({ id, status }: { id: number, status: string }) => {
  //     const res = await apiRequest("PATCH", `/api/contact-requests/${id}/status`, { status });
  //     return res.json();
  //   },
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: [`/api/contact-requests/user/${currentUserId}`] });
  //     queryClient.invalidateQueries({ queryKey: [`/api/matches/user/${currentUserId}`] });
      
  //     toast({
  //       title: data.status === "accepted" ? "Request accepted" : "Request declined",
  //       description: data.status === "accepted" 
  //         ? "You can now contact this user via email" 
  //         : "The request has been declined",
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       variant: "destructive",
  //       title: "Error updating request",
  //       description: error instanceof Error ? error.message : "Please try again later",
  //     });
  //   }
  // });
  
  // const handleRequest = (id: number, status: "accepted" | "rejected") => {
  //   contactRequestMutation.mutate({ id, status });
  // };
  
  // // Filter contact requests by status
  // const pendingRequests = contactRequests?.filter(req => 
  //   req.toUserId === currentUserId && req.status === "pending"
  // );
  
  // const sentRequests = contactRequests?.filter(req => 
  //   req.fromUserId === currentUserId
  // );
  
  // if (!profile && !profileLoading) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 text-center">
  //       <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
  //       <p className="text-gray-600 mb-8">
  //         You haven't created a profile yet. Create one to start connecting with others.
  //       </p>
  //       <Button asChild>
  //         <Link href="/create-profile">Create Profile</Link>
  //       </Button>
  //     </div>
  //   );
  // }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <VerifyBadge  verified={"False"} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
       {/*  <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="requests">
            Requests {pendingRequests?.length ? `(${pendingRequests.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="matches">
            Matches {matches?.length ? `(${matches.length})` : ''}
          </TabsTrigger>
        </TabsList>
         */}
        {/* Profile Tab */}
        <TabsContent value="profile">
          {!profile ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-48 w-48 rounded-md" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : profile ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-auto">
                    <div className="relative">
                      <img 
                        src={profile.imageUrl} 
                        alt="Your profile" 
                        className="w-full md:w-48 h-48 object-cover grayscale-img rounded-md" 
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute bottom-2 right-2 bg-white"
                        asChild
                      >
                        <Link href="/create-profile">
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {profile.displayName}, {profile.age}
                        </h2>
                        <p className="text-gray-600">{profile.location}</p>
                      </div>
                      <Badge variant={profile.isPublic ? "outline" : "secondary"}>
                        {profile.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">About Me</h3>
                        <p className="text-gray-700 mt-1">{profile.bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">My Journey</h3>
                        <p className="text-gray-700 mt-1">{profile.history}</p>
                      </div>
{/*                       
                      <div>
                        <h3 className="font-semibold text-lg">Interests</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.interests.map((interest, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests">
          <div className="space-y-6">
            {/* Pending Requests */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-24" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingRequests?.length ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <Avatar>
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">User #{request.fromUserId}</p>
                          <p className="text-sm text-gray-500">
                            <Clock className="inline-block h-3 w-3 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          {request.message && (
                            <p className="text-sm mt-1 text-gray-700">"{request.message}"</p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleRequest(request.id, "rejected")}
                            disabled={contactRequestMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-600 hover:bg-green-50"
                            onClick={() => handleRequest(request.id, "accepted")}
                            disabled={contactRequestMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No pending requests at the moment.</p>
                )}
              </CardContent>
            </Card> */}
            
            {/* Sent Requests */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                    ))}
                  </div>
                ) : sentRequests?.length ? (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <Avatar>
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">User #{request.toUserId}</p>
                          <p className="text-sm text-gray-500">
                            <Clock className="inline-block h-3 w-3 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          request.status === "pending" ? "outline" : 
                          request.status === "accepted" ? "default" : "secondary"
                        }>
                          {request.status === "pending" ? "Pending" : 
                           request.status === "accepted" ? "Accepted" : "Declined"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    You haven't sent any requests yet. Browse profiles to find people you'd like to connect with.
                  </p>
                )}
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
        
        {/* Matches Tab */}
        {/* <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {matchesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </div>
                  ))}
                </div>
              ) : matches?.length ? (
                <div className="space-y-6">
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center gap-4 border-b pb-6 last:border-0 last:pb-0">
                      <img
                        src={match.otherProfile?.imageUrl}
                        alt={`${match.otherProfile?.displayName}'s profile`}
                        className="h-16 w-16 object-cover grayscale-img rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{match.otherProfile?.displayName}, {match.otherProfile?.age}</p>
                        <p className="text-sm text-gray-600">{match.otherProfile?.location}</p>
                        <p className="text-sm mt-1">
                          Matched on {new Date(match.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {match.otherUser?.email}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You don't have any matches yet.</p>
                  <Button asChild>
                    <Link href="/browse">Browse Profiles</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default MyProfile;
