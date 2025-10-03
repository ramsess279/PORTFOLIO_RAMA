import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, tu peux ajouter l'envoi du message (emailjs, API, etc.)
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-5 md:py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-primary">Contact</h2>
        <p className="text-center text-base md:text-lg text-muted-foreground mb-8 md:mb-12">
          N'hésitez pas à me contacter pour toute opportunité ou collaboration
        </p>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Bloc infos de contact */}
          <div className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-6 md:gap-8 shadow-xl">
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
                  <div className="font-semibold">ramatoulaye.gueye@email.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 bg-background/60 rounded-lg p-3 md:p-4">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <div className="font-semibold">+221 77 123 45 67</div>
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
                  href="#"
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
            className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-4 md:gap-6 shadow-xl"
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
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 bg-primary text-primary-foreground font-semibold rounded-lg px-6 py-3 hover:bg-primary/90 transition justify-center"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;