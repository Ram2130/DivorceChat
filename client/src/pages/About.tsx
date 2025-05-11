import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, Heart, MessageCircle, AlertTriangle } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Restart</h1>
      
      {/* Our Story Section */}
      <section className="mb-12" id="our-story">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-3/5">
                <p className="text-gray-700 mb-4">
                  Restart was founded with a simple yet powerful mission: to create a safe, respectful dating platform specifically designed for those who have experienced divorce and are ready for a new beginning.
                </p>
                <p className="text-gray-700 mb-4">
                  We understand that dating after divorce comes with its own unique set of challenges and considerations. Many people find that their priorities have shifted, their perspectives have deepened, and their approach to relationships has evolved.
                </p>
                <p className="text-gray-700">
                  That's why we've created a platform that emphasizes meaningful connections based on compatibility, shared experiences, and genuine communication. Our focus on detailed profiles, thoughtfully curated photos, and secure contact methods sets us apart from typical dating apps.
                </p>
              </div>
              <div className="md:w-2/5">
                <img 
                  src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true" 
                  alt="Couple walking together" 
                  className="w-full h-auto rounded-lg grayscale-img shadow-sm" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* How It Works Section */}
      <section className="mb-12" id="how-it-works">
        <h2 className="text-2xl font-bold mb-4">How Restart Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Share your story, interests, and what you're looking for in a new relationship. Upload a photo that will be displayed in our signature black and white style.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Express Interest</h3>
              <p className="text-gray-600">
                When you find someone who catches your attention, you can express interest by sending them a message. This is the first step toward making a connection.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Securely</h3>
              <p className="text-gray-600">
                When both people express mutual interest, email addresses are shared so you can continue your conversation in a secure, private manner.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Security Section */}
      <section className="mb-12" id="security">
        <h2 className="text-2xl font-bold mb-4">Security and Privacy</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start mb-6">
              <Shield className="h-8 w-8 text-green-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Email-Only Approach</h3>
                <p className="text-gray-700">
                  Unlike other dating platforms, Restart uses an email-only contact system. This means your personal contact information is only shared when both parties have expressed mutual interest. This approach provides an additional layer of security and helps prevent unwanted messages.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Privacy Measures</h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• Your email is only shared after mutual interest is confirmed</li>
                  <li>• All profile photos are displayed in black and white, adding a layer of privacy</li>
                  <li>• You control what personal information is visible on your profile</li>
                  <li>• No location tracking or unnecessary data collection</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Safety Tips</h4>
                <ul className="text-amber-700 space-y-2 text-sm">
                  <li>• Meet in public places for your first few meetings</li>
                  <li>• Tell a friend or family member about your plans</li>
                  <li>• Use a separate email address for dating communications</li>
                  <li>• Trust your instincts and take things at your own pace</li>
                  <li>• Report any suspicious behavior to our team</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Help Center Section */}
      <section className="mb-12" id="help">
        <h2 className="text-2xl font-bold mb-4">Help Center</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium">Is Restart only for divorced individuals?</h4>
                    <p className="text-gray-600 mt-1">
                      Yes, Restart is specifically designed for people who have experienced divorce and are looking to start a new chapter in their lives.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Why are all photos in black and white?</h4>
                    <p className="text-gray-600 mt-1">
                      Our black and white aesthetic helps create a cohesive look across the platform, emphasizes facial expressions over superficial traits, and adds an element of privacy and elegance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">How does the email-only contact system work?</h4>
                    <p className="text-gray-600 mt-1">
                      When you express interest in someone and they reciprocate, our system will share email addresses between the matched users. This ensures contact information is only shared with mutual consent.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Need more help?</h4>
                  <p className="text-gray-600 mt-1">
                    If you have any questions or concerns that aren't addressed here, please contact our support team at <a href="mailto:support@restart.com" className="text-primary hover:underline">support@restart.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your New Chapter?</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Join Restart today and connect with others who understand your journey and are looking for meaningful relationships.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/create-profile">Create Your Profile</Link>
        </Button>
      </section>
      
      {/* Legal Links */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div id="privacy">
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <p className="text-sm text-gray-600">
              Restart is committed to protecting your privacy. We only collect the information necessary to provide our service and will never share your personal data with third parties without your explicit consent.
            </p>
          </div>
          <div id="terms">
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <p className="text-sm text-gray-600">
              By using Restart, you agree to our terms of service, which include treating other users with respect, providing accurate information, and using the platform for its intended purpose.
            </p>
          </div>
          <div id="cookies">
            <h3 className="font-semibold mb-2">Cookie Policy</h3>
            <p className="text-sm text-gray-600">
              Restart uses cookies to enhance your browsing experience and provide personalized service. You can adjust your browser settings to manage cookie preferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
