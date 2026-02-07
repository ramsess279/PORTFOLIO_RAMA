import { useEffect, useState, useMemo } from "react";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";
 import { useIsMobile } from "@/hooks/use-mobile";
 import heroData from "@/data/hero.json";

const HeroSection = () => {
  const isMobile = useIsMobile();
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setTypedText("");
    setCurrentPhraseIndex(0);
    setIsDeleting(false);
  }, [heroData.phrases]);

  useEffect(() => {
    const currentPhrase = heroData.phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % heroData.phrases.length);
      } else {
        setTypedText(
          isDeleting
            ? currentPhrase.substring(0, typedText.length - 1)
            : currentPhrase.substring(0, typedText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex, heroData.phrases]);

  return (
    <section className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-10 sm:py-20 pb-24 sm:pb-32 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      <div className="container max-w-6xl relative z-10 pl-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
          <div className={`animate-slide-in-left space-y-6 min-w-0 ${isMobile ? 'flex flex-col items-center text-center' : ''}`}> 
            {/* Responsive: largeur et centrage adaptés */}
            <div className="h-20 md:h-24 mb-1 flex items-center w-full justify-center md:justify-start p-0 m-0">
              <div className="w-48 sm:w-56 md:w-96 mx-auto">
                <h1 className={`font-bold text-foreground inline-block overflow-hidden text-xs sm:text-2xl md:text-4xl whitespace-nowrap w-full ${isMobile ? 'text-center' : 'text-left'}`}
                >
                  {typedText}
                  <span className="text-primary animate-pulse">|</span>
                </h1>
              </div>
            </div>
            <p className={`text-base sm:text-lg md:text-xl text-muted-foreground ${isMobile ? 'text-center' : ''}`}
              style={{maxWidth: isMobile ? 320 : 'none', margin: isMobile ? '0 auto' : undefined}}>
              {heroData.description}
            </p>
            <div className={`flex gap-2 sm:gap-4 flex-wrap max-w-xs ${isMobile ? 'justify-center' : ''}`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow group flex-1 min-w-0 text-sm sm:text-base py-2 sm:py-3" asChild>
                <a href={`mailto:${heroData.socialLinks.email}`}>
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                  <span className="hidden sm:inline">Contact</span>
                </a>
              </Button>
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover-glow group flex-1 min-w-0 text-sm sm:text-base py-2 sm:py-3" asChild>
                <a href={heroData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover-glow group flex-1 min-w-0 text-sm sm:text-base py-2 sm:py-3" asChild>
                <a href={heroData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            </div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{heroData.location}</span>
              </div>
            </div>
          </div>
          <div className="animate-slide-in-right flex justify-center md:justify-end mt-6 md:mt-0">
            <Card className="p-4 sm:p-6 md:p-8 rounded-3xl max-w-xs w-full md:max-w-md md:w-full flex flex-col items-center border-0 shadow-none">
              {/* Responsive: taille de la photo adaptée */}
              {!imgError ? (
                <img
                  src={heroData.profileImage}
                  alt="Photo de profil"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-full object-cover mb-4 mx-auto"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                  <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary">{heroData.fallbackInitials}</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
