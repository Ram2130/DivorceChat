import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProfileSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InterestTag from "@/components/InterestTag";
import { Loader2 } from "lucide-react";

// Extend the insert profile schema with additional validation
const createProfileSchema = z.object({
   email: z.string().min(2, "email must be at least 2 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
  Name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "You must be at least 18 years old").max(120, "Invalid age"),
  location: z.string().min(3, "Please provide your location"),
  bio: z.string().min(50, "Bio should be at least 50 characters").max(500, "Bio cannot exceed 500 characters"),
  history: z.string().min(50, "Please share a bit about your journey").max(500, "History cannot exceed 500 characters"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  divorcedYears: z.coerce.number().min(0, "Cannot be negative").optional(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

const CreateProfile = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Mock user ID (in a real app, this would come from auth)
  const currentUserId = 1;
  
  const { data: interests } = useQuery({
    queryKey: ['/api/interests'],
  });
  
  const form = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      email:"",
      password:"",
      Name: "",
      age: undefined,
      location: "",
      bio: "",
      history: "",
      imageUrl: "",
      divorcedYears: undefined,
      interests: [],
    },
  });
  
  const createProfileMutation = useMutation({
    mutationFn: async (formData: CreateProfileFormValues) => {
      const profileData = {
        ...formData,
        userId: currentUserId,
        isPublic: true,
      };
      
      const res = await apiRequest("POST", "/api/profiles", profileData);
       

      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile created!",
        description: "Your profile has been created successfully.",
      });
      localStorage.setItem('token',data.token);
      navigate(`/profile/${data.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    }
  });
  
  const onSubmit = (data: CreateProfileFormValues) => {
    createProfileMutation.mutate(data);
  };
  
  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues().interests;
    const isSelected = currentInterests.includes(interest);
    
    if (isSelected) {
      form.setValue("interests", currentInterests.filter(i => i !== interest), { shouldValidate: true });
    } else {
      form.setValue("interests", [...currentInterests, interest], { shouldValidate: true });
    }
  };
  
  // Sample profile images
  const sampleImages = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true"
  ];
  
  const selectSampleImage = (url: string) => {
    form.setValue("imageUrl", url, { shouldValidate: true });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Profile</CardTitle>
          <CardDescription>
            Share your story and interests to connect with others on a similar journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="divorcedYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Since Divorce</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many years has it been since your divorce? (Optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* About You Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About You</h3>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share a bit about yourself, your interests, and what you enjoy in life..." 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be the main text people read on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Journey</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share a bit about your past relationship, what you've learned, and how you've grown..." 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This helps others understand your experience and perspective.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Photo</h3>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/your-photo.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the URL of your profile photo. It will be displayed in black and white.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Sample images to choose from */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Or select from our sample photos:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sampleImages.map((url, index) => (
                      <div 
                        key={index} 
                        className={`relative cursor-pointer rounded-md overflow-hidden h-24 border-2 ${form.getValues().imageUrl === url ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => selectSampleImage(url)}
                      >
                        <img 
                          src={url} 
                          alt={`Sample profile ${index + 1}`} 
                          className="w-full h-full object-cover grayscale-img" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Interests Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormDescription>
                        Select interests that you'd like to share on your profile.
                      </FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {interests && interests.map((interest, index) => (
                          <InterestTag 
                            key={index} 
                            name={interest} 
                            selected={form.getValues().interests.includes(interest)} 
                            onClick={() => toggleInterest(interest)} 
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProfile;
