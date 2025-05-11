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

function App() {
  return (
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
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
