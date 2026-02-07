import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";
  import { useState } from "react";
  import { useIsMobile } from "@/hooks/use-mobile";
  import { useToast } from "@/hooks/use-toast";
  import emailjs from '@emailjs/browser';

const Contact = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser EmailJS
  emailjs.init('uAT3KZe3BBX3kPeuH');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Formulaire soumis avec les données:', form);

    try {
      console.log('Début de l\'envoi réel via EmailJS...');
      // Envoi réel via EmailJS
      await emailjs.send(
        'service_d9jqt1l',
        'template_vxe8mpu',
        {
          name: form.name,
          email: form.email,
          message: form.message,
        }
      );
      console.log('Email envoyé avec succès via EmailJS');

      // Afficher le toast de succès
      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
        duration: 5000,
      });

      // Réinitialiser le formulaire
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      // Afficher le toast d'erreur
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      console.log('Fin du processus d\'envoi, loading à false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-5 md:pt-10 pb-20 md:pb-32 px-4">
      <div className="container max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
          {/* Bloc infos de contact */}
          <div className={`glass rounded-2xl ${isMobile ? 'p-4' : 'p-6 md:p-8'} flex flex-col gap-6 md:gap-8 shadow-xl order-2 md:order-1 ${isMobile ? 'mx-2.5' : ''}`}>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
              Informations de contact
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Vous pouvez me joindre via ces différents canaux
            </p>
            <div className="flex flex-col gap-4 md:gap-5 text-base md:text-lg">
              <div className="flex items-center gap-3 md:gap-4 bg-background/60 rounded-lg p-3 md:p-4">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href="mailto:ramatoulaye.rtg@gmail.com" className="font-semibold hover:text-primary/80 transition-colors">ramatoulaye.rtg@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 bg-background/60 rounded-lg p-3 md:p-4">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <a href="https://wa.me/221771279062" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary/80 transition-colors">+221 77 127 90 62</a>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 bg-background/60 rounded-lg p-3 md:p-4">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Localisation</div>
                  <div className="font-semibold">Dakar, Sénégal</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Réseaux sociaux</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 hover:bg-primary/10 transition"
                >
                  <Github className="h-5 w-5" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/rama-gueye-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 hover:bg-primary/10 transition"
                >
                  <Linkedin className="h-5 w-5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
          {/* Bloc formulaire */}
          <form
            onSubmit={handleSubmit}
            className={`glass rounded-2xl ${isMobile ? 'p-4' : 'p-6 md:p-8'} flex flex-col gap-4 md:gap-6 shadow-xl order-1 md:order-2 ${isMobile ? 'mx-2.5' : ''}`}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
              Envoyez-moi un message
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-2">
              Je vous répondrai dans les plus brefs délais
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm mb-1"
                >
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isLoading}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  disabled={isLoading}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 font-semibold rounded-lg px-6 py-3 transition justify-center glass border border-primary/50 ${
                isLoading
                  ? "bg-primary/60 text-white cursor-not-allowed"
                  : "bg-primary/80 text-white hover:bg-primary/90"
              }`}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;