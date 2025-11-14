import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Truck, Star, Crown, Scissors, Heart } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Handcrafted with precision using ethically sourced, 100% natural hair.",
    },
    {
      icon: Shield,
      title: "Customized Comfort",
      description: "Tailored fit for your head shape, tone, and style preference.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your perfect look delivered quickly and safely.",
    },
  ];

  const testimonials = [
    {
      name: "Vivian E.",
      rating: 5,
      text: "Absolutely stunning! The quality exceeded my expectations. I feel like royalty every time I wear it.",
    },
    {
      name: "Deborah E.",
      rating: 5,
      text: "The customization process was seamless and the final product is perfection. Worth every penny!",
    },
    {
      name: "Favour H.",
      rating: 5,
      text: "Best investment I've made in myself. The craftsmanship is impeccable and it looks so natural!",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden animate-fade-in">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/src/assets/vid1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-background/60" />
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-0" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 transform hover:scale-105 transition-transform duration-300 animate-fade-in animate-delay-100">
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <img 
                    src="/src/assets/logo*.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-muted-foreground">Premium Luxury Wigs</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight animate-fade-in animate-delay-200">
                Crown Your
                <div className="text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Confidence
                </div>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 animate-fade-in animate-delay-300">
                Stay slayed , stay elegant
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in animate-delay-400">
                <Link to="/shop">
                  <Button variant="luxury" size="lg" className="text-lg px-8 py-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-5 pt-8 animate-fade-in animate-delay-500">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-accent/30 p-1 bg-background">
                  <img 
                    src="/src/assets/logo*.jpg" 
                    alt="Domtornyluxe Hairmpire Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trusted by <span className="font-medium text-foreground">100+</span> customers
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background transform transition-all duration-500 hover:shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience the Difference</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our wigs are crafted with precision and care, ensuring you look and feel your absolute best.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about their experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.text}"</p>
                  <p className="font-medium">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5 transform transition-all duration-500 hover:shadow-2xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Look?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover the perfect wig that matches your style and personality.
            </p>
            <Link to="/shop">
              <Button variant="luxury" size="lg" className="text-lg px-8 py-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Shopping Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
