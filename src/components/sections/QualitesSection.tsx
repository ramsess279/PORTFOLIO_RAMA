import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const AproposSection = () => {
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
    <section className="min-h-screen flex items-center justify-center py-10 pb-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-8 text-primary">Contact</h2>
        <p className="text-center text-lg text-muted-foreground mb-12">
          N'hésitez pas à me contacter pour toute opportunité ou collaboration
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Bloc infos de contact */}
          <div className="glass rounded-2xl p-8 flex flex-col gap-8">
            <h3 className="text-2xl font-bold mb-2 text-foreground">
              Informations de contact
            </h3>
            <p className="text-muted-foreground mb-4">
              Vous pouvez me joindre via ces différents canaux
            </p>
            <div className="flex flex-col gap-5 text-lg">
              <div className="flex items-center gap-4 bg-background/60 rounded-lg p-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold">ramatoulaye.gueye@email.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-background/60 rounded-lg p-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <div className="font-semibold">+221 77 123 45 67</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-background/60 rounded-lg p-4">
                <MapPin className="h-6 w-6 text-primary" />
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
            className="glass rounded-2xl p-8 flex flex-col gap-6"
          >
            <h3 className="text-2xl font-bold mb-2 text-foreground">
              Envoyez-moi un message
            </h3>
            <p className="text-muted-foreground mb-2">
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
              className="mt-2 bg-primary text-primary-foreground font-semibold rounded-lg px-6 py-3 hover:bg-primary/90 transition flex items-center gap-2 justify-center"
            >
              <span>Envoyer le message</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l15.75-8.25m0 0v16.5m0-16.5L2.25 12"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AproposSection;
