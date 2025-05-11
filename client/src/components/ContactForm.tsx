import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContactFormProps {
  profileId: number;
  toUserId: number;
  fromUserId?: number;
}

const ContactForm = ({ profileId, toUserId, fromUserId }: ContactFormProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [contactEmail, setContactEmail] = useState<string | null>(null);

  const contactMutation = useMutation({
    mutationFn: async () => {
      if (!fromUserId) {
        throw new Error("You must be logged in to contact other users");
      }
      
      const res = await apiRequest("POST", "/api/contact-requests", {
        fromUserId,
        toUserId,
        message
      });
      
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Interest expressed!",
        description: data.alreadyMatched 
          ? "You have a mutual match! You can now contact this user directly." 
          : "We'll notify you when they respond to your interest.",
      });
      
      // If there is already a match, we'll have the contact email in the response
      if (data.alreadyMatched && data.contactEmail) {
        setContactEmail(data.contactEmail);
      }
      
      setMessage("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error expressing interest",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate();
  };

  if (contactEmail) {
    return (
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <Alert className="bg-transparent border-blue-200">
          <Mail className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-blue-800">Contact Information</AlertTitle>
          <AlertDescription className="text-blue-700">
            <p>You can now contact this user directly at:</p>
            <p className="font-medium mt-2">{contactEmail}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
        <div>
          <h4 className="font-medium text-blue-800">Secure Contact</h4>
          <p className="text-sm text-blue-700 mt-1">
            For privacy and security, we only share email addresses after mutual interest is confirmed.
          </p>
          
          {fromUserId ? (
            <form onSubmit={handleSubmit} className="mt-3">
              <Textarea
                placeholder="Add a personal message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-24 bg-white border-blue-200"
              />
              <Button 
                type="submit" 
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Processing..." : "Express Interest"}
              </Button>
            </form>
          ) : (
            <div className="mt-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                onClick={() => toast({
                  variant: "destructive",
                  title: "Please log in",
                  description: "You need to create a profile to contact other users."
                })}
              >
                Create Profile to Connect
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
