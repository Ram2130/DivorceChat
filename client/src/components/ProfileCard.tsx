import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileWithUser } from "@shared/schema";

interface ProfileCardProps {
  profile: ProfileWithUser;
  compact?: boolean;
}

const ProfileCard = ({   id,profile, compact = false }: ProfileCardProps) => {
  return (
    <Link href={`/profile/${id}`}>
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        <div className={`${compact ? 'h-48' : 'h-64'} overflow-hidden`}>
          <img 
            src={profile.imageUrl} 
            alt={`${profile.displayName}'s profile photo`} 
            className="w-full h-full object-cover grayscale-img" 
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">
            {profile.displayName}, {profile.age}
          </h3>
          <p className="text-gray-600 text-sm">{profile.location}</p>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {profile.interests?.slice(0, 3).map((interest, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {interest}
              </span>
            ))}
            {profile.interests?.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>
          
          {!compact && profile.bio && (
            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {profile.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
