import { Mail, Github, Linkedin, MapPin, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { useReveal } from "@/hooks/useReveal";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const { toast } = useToast();
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  emailjs.init("uAT3KZe3BBX3kPeuH");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await emailjs.send("service_d9jqt1l", "template_vxe8mpu", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
        duration: 5000,
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className="pt-28 pb-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Parlons-en"
          title={
            <>
              Une idée, un <em className="accent-italic">projet</em> ?
            </>
          }
          subtitle="N'hésitez pas à me contacter pour toute opportunité ou collaboration."
        />

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          {/* Infos */}
          <div className="reveal-blur">
            <h3 className="text-lg text-primary mb-6">Informations de contact</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <a
                    href="mailto:ramatoulaye.rtg@gmail.com"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    ramatoulaye.rtg@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-muted-foreground">Téléphone</div>
                  <a
                    href="https://wa.me/221771279062"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    +221 77 127 90 62
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-muted-foreground">Localisation</div>
                  <div className="font-medium">Dakar, Sénégal</div>
                </div>
              </div>
            </div>

            <h4 className="text-lg text-primary mb-4 mt-10">Réseaux sociaux</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/rama-lpb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rama-gueye-"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="reveal-blur flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block text-xs text-muted-foreground mb-1.5">
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
                className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs text-muted-foreground mb-1.5">
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
                className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs text-muted-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                disabled={isLoading}
                value={form.message}
                onChange={handleChange}
                className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full border border-primary px-7 py-3 text-xs tracking-[0.14em] uppercase text-foreground overflow-hidden transition-colors hover:text-primary-foreground disabled:opacity-50 disabled:pointer-events-none"
            >
              <span
                className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ background: "var(--gradient-primary)" }}
              />
              {isLoading ? "Envoi en cours..." : "Envoyer le message"}
              {!isLoading && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
