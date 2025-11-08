import { Switch, Route } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Browse from "@/pages/Browse";
import About from "@/pages/About";
import CreateProfile from "@/pages/CreateProfile";
import MyProfile from "@/pages/MyProfile";
import NotFound from "@/pages/not-found";
import { ProfileProvider } from "./ContextApi/contextApi";
import LoginOtpCard from "./pages/Login";

function App() {
  return (

     <ProfileProvider >
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/browse" component={Browse} />
          <Route path="/about" component={About} />
          <Route path="/create-profile" component={CreateProfile} />
          <Route path="/my-profile" component={MyProfile} />
          <Route path="/login" component={LoginOtpCard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
    </ProfileProvider>
  );
}

export default App;
