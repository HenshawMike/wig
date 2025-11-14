import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Heart, Globe } from "lucide-react";

const About = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              Our Story
            </h1>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
              Domtornyluxe Hairmpire was born from a vision to empower women through the beauty of luxury hair design.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold">The Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe every woman deserves to feel regal. Our wigs blend art, precision, and elegance to bring out your inner queen.
                </p>
                <p className="text-lg text-muted-foreground">
                  Each piece is more than just hair it's a statement of confidence, beauty, and power.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-card">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/logo1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-card">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/vid1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold">Craftsmanship</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Each wig is handcrafted with care, combining expert technique and modern styling for a flawless finish.
                </p>
                <p className="text-lg text-muted-foreground">
                  We use only the finest ethically sourced, 100% natural hair, ensuring premium quality in every strand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every wig meets our highest standards of craftsmanship.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Empowerment</h3>
                <p className="text-muted-foreground">
                  We create more than wigs we craft confidence and help women feel their absolute best.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Fast worldwide delivery ensures luxury hair care reaches confident women everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
