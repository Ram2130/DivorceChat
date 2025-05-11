import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Heart } from "lucide-react";

const Home = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['/api/profiles'],
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Find a New Beginning
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          Restart is a dating platform dedicated to those who are embracing a fresh start after divorce.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/browse">Browse Profiles</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/create-profile">Create Your Profile</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-white rounded-xl shadow-sm my-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            Why Restart <Heart className="ml-2 text-primary h-6 w-6" />
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Curated Profiles</h3>
              <p className="text-gray-600">
                Our focus on detailed bios and interests helps you find genuine connections based on compatibility.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Email-Only Contact</h3>
              <p className="text-gray-600">
                We prioritize your privacy and security with our email-only contact system.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Shared Experiences</h3>
              <p className="text-gray-600">
                Connect with others who understand your journey through divorce and are ready for a new chapter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Profiles</h2>
          <Link href="/browse" className="text-primary flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="h-48 w-full" />
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
          
          {profiles && profiles.slice(0, 4).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} compact />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="px-6">
            <Link href="/browse">Browse More</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
