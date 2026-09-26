import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Gift, Heart, Menu, Music2, Pause, Play, Plus, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthday } from "@/lib/birthday-content";
import hero from "@/assets/birthday-hero.jpg";

export const Route = createFileRoute("/")({
  component: BirthdayPage,
});

const nav = [
  ["Home", "home"], ["Memories", "memories"], ["About You", "about-you"],
  ["Things I Love", "things-i-love"], ["Scrapbook", "scrapbook"],
  ["Letter", "letter"], ["Surprise", "surprise"],
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return <div className="section-heading reveal"><span className="eyebrow">{kicker}</span><h2 className="display-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

function Polaroid({ memory, index, compact = false }: { memory: typeof birthday.memories[number]; index: number; compact?: boolean }) {
  return <figure className={`polaroid polaroid-${index % 5} ${compact ? "polaroid-compact" : ""}`}>
    <div className="photo-wrap"><img src={memory.image} alt={memory.alt} loading="lazy" width={912} height={1104} /></div>
    <figcaption><span>{memory.caption}</span><small>{memory.date}</small></figcaption>
  </figure>;
}

function BirthdayPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGift, setOpenGift] = useState<number | null>(null);
  const [finalOpen, setFinalOpen] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const [extraMemories, setExtraMemories] = useState<{ image: string; caption: string; date: string; alt: string }[]>([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicSource, setMusicSource] = useState(birthday.musicSrc);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [extraMemories]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { setOpenGift(null); setFinalOpen(false); setMenuOpen(false); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openGift !== null || finalOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openGift, finalOpen, menuOpen]);

  function addMemory(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    setExtraMemories((prev) => [...prev, ...files.map((file) => ({ image: URL.createObjectURL(file), caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "), date: "a new little memory", alt: file.name }))]);
    e.target.value = "";
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) { audio.pause(); setMusicPlaying(false); }
    else if (musicSource) { try { await audio.play(); setMusicPlaying(true); } catch { setMusicPlaying(false); } }
    else document.getElementById("music-upload")?.click();
  }

  function chooseMusic(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicSource(URL.createObjectURL(file));
    setTimeout(() => { audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false)); }, 0);
  }

  return <div className="birthday-site">
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={() => setMenuOpen(false)} aria-label="Hafsa, back to top"><span className="logo-heart">♡</span><span>for hafsa<span className="wordmark-dot">.</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <Button variant="ghost" size="icon" className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></Button>
    </header>

    {menuOpen && <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}><nav className="mobile-menu" aria-label="Mobile navigation" onClick={(e) => e.stopPropagation()}><div className="mobile-menu-top"><span>for hafsa ♡</span><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button></div>{nav.map(([label, id], i) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}><small>0{i + 1}</small>{label}<ArrowUpRight size={18} /></a>)}</nav></div>}

    <main>
      <section id="home" className="hero">
        <img className="hero-image" src={hero} alt="A birthday cake surrounded by flowers, ribbons, balloons, and gifts" width={1408} height={1200} />
        <div className="hero-wash" />
        <div className="hero-content"><span className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> TODAY IS ALL ABOUT YOU ✦</span><h1>Happy Birthday,<br /><em>Hafsa.</em><span className="hero-heart">♡</span></h1><p>To one of the most special people in my life — here’s a little corner of the internet made just for you.</p><Button className="pill-button hero-cta" onClick={() => scrollTo("intro")}>Start the surprise <ArrowRight size={16} /></Button></div>
        <div className="hero-bottom"><span>A LITTLE JOURNEY, JUST FOR YOU</span><a href="#intro" aria-label="Scroll to the note"><ArrowDown size={19} /></a><span>MADE WITH LOVE ♡</span></div>
      </section>

      <section id="intro" className="intro-section section-pad"><div className="intro-inner reveal"><div className="intro-spark">✳</div><span className="eyebrow">A NOTE BEFORE WE BEGIN</span><h2>Before you <em>explore...</em></h2><p>Some people come into your life and quietly make everything brighter. This little website is just a small way of celebrating you, our memories, and all the little things that make you so special.</p><div className="handwritten intro-signoff">Now... let’s begin. ♡</div><Button variant="outline" className="outline-button" onClick={() => scrollTo("memories")}>Open the memories <ArrowRight size={16} /></Button></div><span className="intro-flower flower-left">✿</span><span className="intro-flower flower-right">✻</span></section>

      <section id="memories" className="memories-section section-pad"><div className="content-width"><SectionTitle kicker="CHAPTER 01 / THE MOMENTS" title="Our Little Memories" subtitle="A tiny collection of moments that deserve to stay forever." /><div className="memories-grid">{birthday.memories.map((memory, i) => <Polaroid key={i} memory={memory} index={i} />)}</div><p className="memories-footer handwritten">The little things were the big things all along. ♡</p></div></section>

      <section id="about-you" className="about-section section-pad"><div className="about-inner reveal"><span className="eyebrow">A PORTRAIT IN WORDS</span><h2>If I had to describe you<br />in one word...</h2><div className="impossible">Impossible<span>.</span></div><p>Because you’re a hundred little things at once.</p><div className="word-cloud">{["Kind", "Funny", "Beautiful", "Chaotic", "Caring", "Unforgettable", "Special", "Hafsa"].map((word) => <span key={word}>{word}</span>)}</div></div></section>

      <section id="things-i-love" className="love-section section-pad"><div className="content-width"><SectionTitle kicker="CHAPTER 02 / ALL THE REASONS" title="Things I Love About You" subtitle="Because apparently, one page wasn't enough." /><div className="qualities-grid">{birthday.qualities.map((quality, i) => <div className="quality-card reveal" key={quality.title}><span className={`quality-icon quality-icon-${i}`}>{quality.symbol}</span><span className="quality-number">0{i + 1}</span><h3>{quality.title}</h3><p>{quality.text}</p></div>)}</div><div className="love-feature reveal"><span>✦</span><p>You’re genuinely <em>one of a kind.</em></p><span>✦</span></div></div></section>

      <section id="surprise" className="gifts-section section-pad"><div className="content-width"><SectionTitle kicker="CHAPTER 03 / JUST FOR YOU" title="Little Surprises" subtitle="Go on, pick one. They’re all yours." /><div className="gifts-grid">{birthday.gifts.map((gift, i) => <Button variant="ghost" className="gift-item reveal" key={gift.label} onClick={() => setOpenGift(i)} aria-label={`Open ${gift.label}`}><span className="gift-art"><span className="gift-lid" /><span className="gift-box"><span className="gift-ribbon" /></span><span className="gift-bow">{gift.icon}</span></span><span className="gift-label">{gift.label}<ArrowUpRight size={17} /></span><small>GIFT 0{i + 1}</small></Button>)}</div></div></section>

      <section id="scrapbook" className="scrapbook-section section-pad"><div className="content-width"><SectionTitle kicker="CHAPTER 04 / KEEP FOREVER" title="Our Little Scrapbook" subtitle="A handful of moments I never want to forget." /><div className="scrapbook-page"><span className="scrapbook-stamp">THE GOOD DAYS<br />ARE THESE DAYS ♡</span><span className="scrapbook-doodle scrapbook-doodle-one">✳</span><span className="scrapbook-doodle scrapbook-doodle-two">♡</span><div className="scrapbook-images">{birthday.memories.slice(0, 3).map((memory, i) => <div className="scrapbook-image-item" key={i}><Polaroid memory={memory} index={i} compact />{i === 0 && <div className="scrapbook-note handwritten">Some days feel like sunshine, simply because you were there. ♡</div>}</div>)}</div><div className="extra-memories">{extraMemories.map((memory, i) => <Polaroid key={memory.image} memory={memory} index={i} compact />)}</div><div className="scrapbook-bottom"><span className="handwritten">to be continued...</span><input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={addMemory} aria-label="Choose memory photos" /><Button variant="outline" className="outline-button" onClick={() => fileRef.current?.click()}><Plus size={17} /> Add another memory</Button></div></div></div></section>

      <section id="letter" className="letter-section section-pad"><div className="content-width"><SectionTitle kicker="CHAPTER 05 / FROM THE HEART" title="A Letter For You" subtitle="From my heart to yours." /><div className="letter-paper reveal"><div className="letter-top"><span>DEAR HAFSA</span><Heart size={18} strokeWidth={1.3} /></div><div className="letter-copy">{birthday.letter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><span className="letter-seal">♡</span></div></div></section>

      <section className="cake-section section-pad"><div className="cake-content reveal"><span className="eyebrow">ONE LITTLE WISH</span><h2>Make a wish, <em>Hafsa.</em> ✨</h2><p>Close your eyes. Think of something wonderful.</p><div className={`cake-illustration ${candlesOut ? "candles-out" : ""}`} role="img" aria-label={candlesOut ? "Birthday cake with blown-out candles" : "Birthday cake with lit candles"}><div className="candles">{[0, 1, 2].map((i) => <span className="candle" key={i}><span className="flame" /><span className="smoke">∿</span></span>)}</div><div className="cake-top" /><div className="cake-body"><span className="cake-detail">♡</span></div><div className="cake-plate" /></div><Button className="pill-button" onClick={() => setCandlesOut((value) => !value)}>{candlesOut ? "Make another wish" : "Blow out the candles"} <span aria-hidden="true">✧</span></Button>{candlesOut && <div className="wish-result"><strong>Wish granted. ♡</strong><p>Okay... we can’t actually guarantee that. But we’re rooting for you.</p><span className="wish-confetti" aria-hidden="true">✦ ✧ ✿ ♡ ✦</span></div>}</div></section>

      <section className="final-section section-pad"><div className="final-content reveal"><span className="eyebrow">THE LAST PAGE... OR IS IT?</span><div className="final-ornament">✳</div><h2>One More <em>Surprise...</em></h2><p>Because celebrating you should never really end.</p><Button className="pill-button final-button" onClick={() => setFinalOpen(true)}>Open your final gift <Gift size={18} /></Button></div></section>
    </main>

    <footer className="site-footer"><span className="footer-mark">♡</span><p>Made with way too much love for Hafsa. ♡</p><span>HAPPY BIRTHDAY, HAFSA ✦</span></footer>

    <div className="music-control"><input id="music-upload" type="file" accept="audio/*" className="sr-only" onChange={chooseMusic} aria-label="Choose birthday music" /><audio ref={audioRef} src={musicSource || undefined} loop onEnded={() => setMusicPlaying(false)} /><Button variant="outline" size="icon" onClick={toggleMusic} aria-label={musicPlaying ? "Pause music" : musicSource ? "Play music" : "Choose music file"} title={musicPlaying ? "Pause music" : musicSource ? "Play music" : "Choose your birthday music"}>{musicPlaying ? <Pause size={18} /> : musicSource ? <Play size={18} /> : <Music2 size={18} />}</Button>{musicSource && <Button variant="ghost" size="icon" onClick={() => document.getElementById("music-upload")?.click()} aria-label="Change music" title="Change music"><Volume2 size={16} /></Button>}</div>

    {(openGift !== null || finalOpen) && <div className="modal-overlay" onClick={() => { setOpenGift(null); setFinalOpen(false); }}><div className="surprise-modal" role="dialog" aria-modal="true" aria-label={finalOpen ? "Final birthday surprise" : (birthday.gifts[openGift ?? 0]?.title ?? "Birthday surprise")} onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="modal-close" onClick={() => { setOpenGift(null); setFinalOpen(false); }} aria-label="Close surprise"><X size={20} /></Button><div className="modal-sparkles" aria-hidden="true">✦ &nbsp; ♡ &nbsp; ✧</div><span className="eyebrow">{finalOpen ? "FOR YOU, ALWAYS" : "A LITTLE SOMETHING FOR YOU"}</span><div className="modal-symbol">{finalOpen ? "♡" : birthday.gifts[openGift ?? 0]?.icon}</div><h2>{finalOpen ? "Happy Birthday, Hafsa!" : birthday.gifts[openGift ?? 0]?.title}</h2><p>{finalOpen ? birthday.finalMessage : birthday.gifts[openGift ?? 0]?.message}</p>{finalOpen && <Button className="pill-button" onClick={() => { setFinalOpen(false); setCandlesOut(false); scrollTo("home"); }}>Replay the journey ↺</Button>}<span className="modal-bottom">WITH ALL MY LOVE ♡</span></div></div>}
  </div>;
}