import { useState } from 'react';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import './contact.scss';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact-page">
      <p className="eyebrow">Contact</p>
      <SplitReveal as="h1" type="lines" immediate className="contact-page__title">
        Tell me about
        <br />
        your project.
      </SplitReveal>

      {sent ? (
        <p className="contact-page__sent">Thanks — I&rsquo;ll get back to you within a day.</p>
      ) : (
        <form className="contact-page__form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input type="text" name="name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" required />
          </label>
          <label>
            <span>Project details</span>
            <textarea name="message" rows={4} required />
          </label>
          <MagneticButton as="button" type="submit" cursorLabel="Send" className="contact-page__submit">
            Send message <span className="arrow">↗</span>
          </MagneticButton>
        </form>
      )}
    </section>
  );
}
