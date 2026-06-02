import { requireAdmin } from "@/lib/admin/require-admin"

const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DoisB Sistemas — Plano de Start</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Press+Start+2P&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }
  :root {
    --black: #010102; --blue-primary: #0169b2; --blue-mid: #278cca; --blue-light: #6eb9e7;
    --white: #ffffff; --gray-50: #f7f9fb; --gray-200: #e5ecf2; --gray-400: #94a3b8; --gray-600: #475569;
    --font-display: 'Bungee', monospace; --font-pixel: 'Press Start 2P', monospace;
    --font-mono: 'JetBrains Mono', monospace; --font-body: 'Manrope', sans-serif;
  }
  body { font-family: var(--font-body); background: var(--black); color: var(--white); -webkit-font-smoothing: antialiased; }
  .deck { width: 100vw; height: 100vh; overflow: hidden; position: relative; }
  .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; visibility: hidden; transition: opacity 500ms ease, transform 500ms ease; display: flex; flex-direction: column; padding: 4.5vh 6vw; }
  .slide.active { opacity: 1; visibility: visible; z-index: 2; }
  .slide.active .stagger > * { animation: fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  .slide.active .stagger > *:nth-child(1) { animation-delay: 0ms; }
  .slide.active .stagger > *:nth-child(2) { animation-delay: 80ms; }
  .slide.active .stagger > *:nth-child(3) { animation-delay: 160ms; }
  .slide.active .stagger > *:nth-child(4) { animation-delay: 240ms; }
  .slide.active .stagger > *:nth-child(5) { animation-delay: 320ms; }
  .slide.active .stagger > *:nth-child(6) { animation-delay: 400ms; }
  .slide.active .stagger > *:nth-child(7) { animation-delay: 480ms; }
  .slide.active .stagger > *:nth-child(8) { animation-delay: 560ms; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .bg-blue { background: var(--blue-primary); color: var(--white); }
  .bg-black { background: var(--black); color: var(--white); }
  .bg-white { background: var(--white); color: var(--black); }
  .bg-gradient { background: linear-gradient(135deg, var(--blue-primary) 0%, #004d83 100%); color: var(--white); }
  .grid-pattern::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
  .grid-pattern-dark::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
  .slide > * { position: relative; z-index: 1; }
  .hud { position: fixed; bottom: 1.5vh; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 2vw; pointer-events: none; }
  .hud-counter { font-family: var(--font-mono); font-size: 13px; color: var(--white); mix-blend-mode: difference; letter-spacing: 0.05em; background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 4px; backdrop-filter: blur(8px); pointer-events: auto; }
  .hud-nav { display: flex; gap: 8px; pointer-events: auto; }
  .hud-btn { width: 36px; height: 36px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: var(--white); border-radius: 4px; cursor: pointer; font-family: var(--font-mono); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 200ms ease; backdrop-filter: blur(8px); }
  .hud-btn:hover { background: var(--blue-primary); border-color: var(--blue-primary); }
  .hud-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--blue-light); z-index: 100; transition: width 400ms ease; box-shadow: 0 0 12px var(--blue-light); }
  .keyhint { position: fixed; top: 1.5vh; right: 2vw; font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.4); mix-blend-mode: difference; z-index: 100; letter-spacing: 0.05em; }
  .logo-doisb { display: inline-flex; flex-direction: column; align-items: flex-start; line-height: 1; }
  .logo-doisb .doisb { font-family: var(--font-display); font-size: clamp(60px, 11vw, 160px); line-height: 0.9; letter-spacing: -0.02em; background: var(--blue-primary); color: var(--white); padding: 0.1em 0.25em 0.15em; display: inline-block; }
  .logo-doisb .sistemas { font-family: var(--font-pixel); font-size: clamp(14px, 1.8vw, 24px); background: var(--black); color: var(--white); padding: 0.6em 1em; margin-top: -0.05em; display: inline-block; letter-spacing: 0.05em; }
  .logo-doisb.invert .doisb { background: var(--white); color: var(--black); }
  .logo-doisb.invert .sistemas { background: var(--black); color: var(--white); }
  .logo-doisb.on-white .doisb { background: var(--blue-primary); color: var(--white); }
  .logo-mini { display: flex; align-items: center; gap: 6px; }
  .logo-mini .doisb-mini { font-family: var(--font-display); font-size: 18px; background: var(--blue-primary); color: var(--white); padding: 4px 8px 6px; line-height: 1; }
  .logo-mini .sistemas-mini { font-family: var(--font-pixel); font-size: 8px; background: var(--black); color: var(--white); padding: 6px 8px; line-height: 1; }
  .bg-blue .logo-mini .doisb-mini { background: var(--white); color: var(--blue-primary); }
  .slide-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2vh; }
  .slide-title { font-family: var(--font-mono); font-size: clamp(14px, 1.3vw, 18px); font-weight: 500; letter-spacing: 0.05em; opacity: 0.7; }
  .slide-title::before { content: '<'; margin-right: 2px; }
  .slide-title::after { content: '/>'; margin-left: 2px; }
  .slide-h1 { font-family: var(--font-body); font-weight: 800; font-size: clamp(36px, 4.5vw, 64px); line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 3vh; }
  .slide-h1 .accent { color: var(--blue-light); }
  .bg-white .slide-h1 .accent { color: var(--blue-primary); }
  .cursor::after { content: '_'; color: var(--blue-light); animation: blink 1s steps(2) infinite; margin-left: 4px; }
  @keyframes blink { 50% { opacity: 0; } }
  .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; backdrop-filter: blur(8px); transition: transform 200ms ease; }
  .card:hover { transform: translateY(-2px); }
  .bg-white .card { background: var(--gray-50); border: 1px solid var(--gray-200); }
  .card-icon { font-family: var(--font-pixel); font-size: 12px; color: var(--blue-light); margin-bottom: 12px; display: inline-block; }
  .bg-white .card-icon { color: var(--blue-primary); }
  .card-title { font-family: var(--font-body); font-weight: 700; font-size: 18px; margin-bottom: 8px; line-height: 1.25; }
  .card-body { font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.75); }
  .bg-white .card-body { color: var(--gray-600); }
  .marker { font-family: var(--font-mono); color: var(--blue-light); margin-right: 8px; font-weight: 600; }
  .bg-white .marker { color: var(--blue-primary); }
  ul.tech-list { list-style: none; padding: 0; }
  ul.tech-list li { font-size: clamp(15px, 1.4vw, 20px); line-height: 1.65; margin-bottom: 12px; padding-left: 28px; position: relative; }
  ul.tech-list li::before { content: '>'; position: absolute; left: 0; font-family: var(--font-mono); color: var(--blue-light); font-weight: 700; }
  .bg-white ul.tech-list li::before { color: var(--blue-primary); }
  .tech-table { width: 100%; border-collapse: collapse; font-size: clamp(13px, 1.1vw, 16px); }
  .tech-table th { text-align: left; font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 16px; border-bottom: 2px solid var(--blue-light); opacity: 0.85; }
  .tech-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .bg-white .tech-table td { border-bottom-color: var(--gray-200); }
  .bg-white .tech-table th { border-bottom-color: var(--blue-primary); }
  .price-cell { font-family: var(--font-mono); font-weight: 700; color: var(--blue-light); }
  .bg-white .price-cell { color: var(--blue-primary); }
  .capa { display: grid; grid-template-rows: 1fr auto; height: 100%; padding: 6vh 6vw; }
  .capa-center { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4vh; }
  .capa-slogan { font-family: var(--font-mono); font-size: clamp(18px, 2vw, 28px); letter-spacing: 0.02em; opacity: 0.95; }
  .capa-meta { display: flex; justify-content: space-between; align-items: flex-end; font-family: var(--font-mono); font-size: 14px; opacity: 0.75; }
  .capa-meta-block { display: flex; flex-direction: column; gap: 6px; }
  .capa-meta-label { font-family: var(--font-pixel); font-size: 9px; opacity: 0.6; text-transform: uppercase; }
  .carta { max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; height: 100%; }
  .carta-frase { font-size: clamp(20px, 2vw, 28px); line-height: 1.5; margin-bottom: 24px; font-weight: 400; }
  .carta-frase strong { color: var(--blue-light); font-weight: 600; }
  .quem-somos { display: grid; grid-template-columns: 1.2fr 1fr; gap: 6vw; align-items: center; height: 100%; }
  .quem-somos-texto p { font-size: clamp(16px, 1.5vw, 20px); line-height: 1.6; margin-bottom: 20px; }
  .quem-somos-texto strong { color: var(--blue-primary); }
  .quem-somos-visual { display: flex; justify-content: center; align-items: center; }
  .mvv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 2vh; }
  .mvv-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 32px 28px; display: flex; flex-direction: column; }
  .mvv-card .mvv-label { font-family: var(--font-pixel); font-size: 11px; color: var(--blue-light); margin-bottom: 16px; letter-spacing: 0.05em; }
  .mvv-card h3 { font-family: var(--font-body); font-weight: 800; font-size: 26px; margin-bottom: 14px; line-height: 1.15; }
  .mvv-card p, .mvv-card ul { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.8); }
  .mvv-card ul { list-style: none; padding: 0; }
  .mvv-card ul li { padding-left: 16px; position: relative; margin-bottom: 6px; }
  .mvv-card ul li::before { content: '>'; position: absolute; left: 0; color: var(--blue-light); font-family: var(--font-mono); }
  .expectativas-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 2vh; }
  .expectativa { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 24px 20px; position: relative; }
  .expectativa-num { font-family: var(--font-pixel); font-size: 28px; color: var(--white); opacity: 0.4; margin-bottom: 16px; }
  .expectativa-text { font-size: 14px; line-height: 1.5; font-weight: 500; }
  .build-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 16px; margin-top: 1vh; flex: 1; }
  .build-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; transition: all 200ms ease; }
  .build-card:hover { border-color: var(--blue-primary); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(1, 105, 178, 0.15); }
  .build-tag { font-family: var(--font-pixel); font-size: 9px; background: var(--blue-primary); color: var(--white); padding: 6px 10px; align-self: flex-start; border-radius: 4px; margin-bottom: 14px; letter-spacing: 0.05em; }
  .build-title { font-family: var(--font-body); font-weight: 700; font-size: 18px; margin-bottom: 8px; color: var(--black); }
  .build-body { font-size: 13px; line-height: 1.5; color: var(--gray-600); flex: 1; }
  .planos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 2vh; }
  .plano-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 32px; display: flex; flex-direction: column; position: relative; }
  .plano-card.destaque { background: var(--blue-primary); border-color: var(--blue-light); transform: scale(1.04); box-shadow: 0 20px 60px rgba(1, 105, 178, 0.4); }
  .plano-badge { position: absolute; top: -12px; right: 24px; background: var(--blue-light); color: var(--black); font-family: var(--font-pixel); font-size: 9px; padding: 6px 10px; border-radius: 4px; letter-spacing: 0.05em; }
  .plano-name { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-bottom: 8px; }
  .plano-titulo { font-family: var(--font-body); font-weight: 800; font-size: 32px; margin-bottom: 12px; }
  .plano-preco { font-family: var(--font-display); font-size: 42px; color: var(--blue-light); margin-bottom: 4px; line-height: 1; }
  .plano-card.destaque .plano-preco { color: var(--white); }
  .plano-preco-suffix { font-family: var(--font-mono); font-size: 13px; opacity: 0.7; margin-bottom: 20px; }
  .plano-desc { font-size: 14px; line-height: 1.5; opacity: 0.85; }
  .divisao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 1vh; flex: 1; }
  .divisao-card { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 32px; display: flex; flex-direction: column; }
  .divisao-name { font-family: var(--font-pixel); font-size: 14px; color: var(--blue-light); margin-bottom: 4px; }
  .divisao-papel { font-family: var(--font-body); font-weight: 800; font-size: 28px; margin-bottom: 24px; }
  .divisao-list { list-style: none; padding: 0; }
  .divisao-list li { font-size: 15px; line-height: 1.45; margin-bottom: 10px; padding-left: 22px; position: relative; }
  .divisao-list li::before { content: '>'; position: absolute; left: 0; color: var(--blue-light); font-family: var(--font-mono); }
  .divisao-list li strong { color: var(--white); font-weight: 700; }
  .divisao-list li span { opacity: 0.75; font-size: 13.5px; }
  .invest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 2vh; }
  .invest-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 28px; }
  .invest-tag { font-family: var(--font-pixel); font-size: 10px; color: var(--blue-light); margin-bottom: 8px; letter-spacing: 0.05em; }
  .invest-title { font-family: var(--font-body); font-weight: 800; font-size: 22px; margin-bottom: 20px; }
  .invest-line { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; }
  .invest-line:last-child { border-bottom: none; }
  .invest-line.total { padding-top: 16px; border-top: 2px solid var(--blue-light); border-bottom: none; margin-top: 8px; font-weight: 700; font-size: 16px; }
  .invest-line .valor { font-family: var(--font-mono); color: var(--blue-light); font-weight: 600; }
  .invest-rationale { grid-column: 1 / -1; margin-top: 16px; padding: 18px 24px; background: rgba(110, 185, 231, 0.1); border-left: 3px solid var(--blue-light); border-radius: 8px; font-size: 14px; line-height: 1.55; }
  .invest-rationale strong { color: var(--blue-light); }
  .ads-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 2vh; flex: 1; }
  .ads-col { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .ads-platform { font-family: var(--font-pixel); font-size: 11px; color: var(--blue-light); margin-bottom: 4px; }
  .ads-name { font-family: var(--font-body); font-weight: 800; font-size: 24px; margin-bottom: 16px; }
  .ads-sub { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blue-light); margin: 12px 0 8px; opacity: 0.85; }
  .ads-col ul { list-style: none; padding: 0; }
  .ads-col ul li { font-size: 13px; line-height: 1.5; margin-bottom: 6px; padding-left: 14px; position: relative; opacity: 0.9; }
  .ads-col ul li::before { content: '·'; position: absolute; left: 0; color: var(--blue-light); }
  .metas-wrapper { margin-top: 1vh; }
  .metas-premissas { font-family: var(--font-mono); font-size: 13px; opacity: 0.75; margin-bottom: 16px; padding: 12px 16px; background: rgba(110, 185, 231, 0.1); border-radius: 6px; border-left: 3px solid var(--blue-light); }
  .metas-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .meta-mes { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; }
  .meta-mes-num { font-family: var(--font-pixel); font-size: 11px; color: var(--blue-light); margin-bottom: 4px; }
  .meta-mes-titulo { font-family: var(--font-body); font-weight: 800; font-size: 20px; margin-bottom: 12px; }
  .meta-row { display: grid; grid-template-columns: 1.2fr 0.9fr 0.9fr; gap: 8px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12.5px; }
  .meta-row:last-child { border-bottom: none; }
  .meta-row .label { opacity: 0.85; }
  .meta-row .v1 { font-family: var(--font-mono); color: var(--blue-light); text-align: right; }
  .meta-row .v2 { font-family: var(--font-mono); color: var(--white); text-align: right; font-weight: 600; }
  .meta-header { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; margin-bottom: 4px; }
  .prolabore { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4vw; align-items: center; height: 100%; margin-top: 0; }
  .prolabore-regra { background: rgba(255,255,255,0.04); border-left: 4px solid var(--blue-light); padding: 28px; border-radius: 8px; margin-bottom: 24px; }
  .prolabore-regra-titulo { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blue-light); margin-bottom: 8px; }
  .prolabore-regra-texto { font-size: 18px; font-weight: 600; line-height: 1.35; }
  .prolabore-detalhes { font-size: 14px; line-height: 1.6; opacity: 0.85; }
  .prolabore-detalhes strong { color: var(--blue-light); }
  .prolabore-divisao { background: rgba(0,0,0,0.25); border-radius: 12px; overflow: hidden; }
  .divisao-titulo { background: var(--blue-primary); padding: 12px 20px; font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
  .divisao-line { display: grid; grid-template-columns: 1fr auto 90px; gap: 16px; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; align-items: center; }
  .divisao-line:last-child { border-bottom: none; }
  .divisao-line .pct { font-family: var(--font-mono); color: var(--blue-light); font-weight: 700; font-size: 14px; }
  .divisao-line .valor { font-family: var(--font-mono); text-align: right; opacity: 0.75; font-size: 13px; }
  .riscos-grid { margin-top: 1vh; }
  .timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 2vh; position: relative; }
  .timeline::before { content: ''; position: absolute; top: 30px; left: 5%; right: 5%; height: 2px; background: linear-gradient(90deg, var(--blue-light) 0%, var(--blue-primary) 100%); z-index: 0; }
  .timeline-week { position: relative; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 24px 20px; z-index: 1; }
  .timeline-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--blue-light); margin-bottom: 14px; box-shadow: 0 0 14px var(--blue-light); }
  .timeline-num { font-family: var(--font-pixel); font-size: 11px; color: var(--blue-light); margin-bottom: 6px; }
  .timeline-titulo { font-family: var(--font-body); font-weight: 800; font-size: 18px; margin-bottom: 14px; }
  .timeline-week ul { list-style: none; padding: 0; }
  .timeline-week ul li { font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 14px; position: relative; opacity: 0.88; }
  .timeline-week ul li::before { content: '·'; position: absolute; left: 0; color: var(--blue-light); }
  .fechamento { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; gap: 4vh; }
  .fechamento-frase { font-family: var(--font-body); font-weight: 800; font-size: clamp(40px, 6vw, 80px); line-height: 1.05; letter-spacing: -0.02em; max-width: 1100px; }
  .fechamento-frase .blue { color: var(--blue-light); }
  .fechamento-list { font-family: var(--font-mono); font-size: clamp(15px, 1.4vw, 19px); line-height: 2; opacity: 0.85; }
  .fechamento-slogan { font-family: var(--font-mono); font-size: clamp(20px, 2.2vw, 32px); margin-top: 2vh; color: var(--blue-light); }
  .slide-content { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .loader { position: fixed; inset: 0; background: var(--black); display: flex; align-items: center; justify-content: center; z-index: 1000; transition: opacity 400ms ease; }
  .loader.hidden { opacity: 0; pointer-events: none; }
  .loader-text { font-family: var(--font-mono); font-size: 14px; color: var(--blue-light); }
  @media (max-width: 1100px) {
    .planos-grid, .mvv-grid { grid-template-columns: 1fr; }
    .quem-somos, .prolabore, .invest-grid, .divisao-grid { grid-template-columns: 1fr; }
    .ads-grid, .build-grid, .metas-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .expectativas-grid { grid-template-columns: 1fr 1fr; }
    .timeline { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>
<div class="loader" id="loader"><div class="loader-text cursor">loading_</div></div>
<div class="progress-bar" id="progressBar"></div>
<div class="keyhint">← → · Space · F (fullscreen)</div>
<div class="deck" id="deck">

  <section class="slide bg-blue grid-pattern" data-slide="1">
    <div class="capa stagger">
      <div class="capa-center">
        <img src="/logos/doisb-color.png" alt="DoisB Sistemas" style="max-width:clamp(240px,30vw,440px);height:auto;filter:brightness(0) invert(1)">
        <div class="capa-slogan">&lt;Venda. Controle. Cresça.&gt;</div>
      </div>
      <div class="capa-meta">
        <div class="capa-meta-block"><span class="capa-meta-label">document</span><span>Plano de Start · Apresentação para o sócio</span></div>
        <div class="capa-meta-block" style="text-align:right"><span class="capa-meta-label">author / date</span><span>Laisa Barth · 06.2026</span></div>
      </div>
    </div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="2">
    <div class="slide-header"><div class="slide-title">carta_abertura</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="carta stagger">
      <h2 class="slide-h1">Por que estamos <span class="accent">aqui hoje</span>.</h2>
      <p class="carta-frase">Pai,</p>
      <p class="carta-frase">Depois de meses de planejamento, construção e estudo, a <strong>DoisB Sistemas</strong> está pronta pra começar a operar de verdade. O site está no ar, o sistema funciona ponta a ponta, os pagamentos estão configurados, o painel de gestão está construído.</p>
      <p class="carta-frase">Mas tecnologia sozinha não vende — <strong>quem vende somos nós</strong>. Por isso, antes de começarmos a oferecer o ZWeb pro mercado, eu quero que a gente alinhe <strong>o que estamos construindo</strong>, <strong>como vamos operar</strong>, <strong>quanto vamos investir</strong> e <strong>onde queremos chegar</strong>.</p>
      <p class="carta-frase">Essa apresentação é o nosso ponto de partida.<span class="cursor"></span></p>
    </div>
  </section>

  <section class="slide bg-white grid-pattern-dark" data-slide="3">
    <div class="slide-header"><div class="slide-title">quem_somos</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="quem-somos stagger">
      <div class="quem-somos-texto">
        <h2 class="slide-h1">Uma empresa <span class="accent">familiar.</span><br>Dois Barth. Duas gerações.</h2>
        <p>A <strong>DoisB Sistemas</strong> é uma empresa familiar, fundada por pai e filha, <strong>Abel e Laisa Barth</strong>, com sede no Rio Grande do Sul.</p>
        <p>Somos revenda autorizada do <strong>ZWeb</strong>, sistema de gestão da <strong>Zucchetti</strong> — primeira software house italiana, com mais de 700 mil clientes ativos no mundo.</p>
        <p>Atendemos pequenos e médios varejistas — mercados, oficinas, lojas, padarias, assistências técnicas e prestadores de serviço — com uma proposta simples: <strong>tecnologia italiana, atendimento brasileiro</strong>.</p>
      </div>
      <div class="quem-somos-visual"><img src="/logos/doisb-color.png" alt="DoisB Sistemas" style="max-width:clamp(200px,28vw,380px);height:auto"></div>
    </div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="4">
    <div class="slide-header"><div class="slide-title">identidade</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <h2 class="slide-h1 stagger"><span>Nossa identidade.</span></h2>
    <div class="mvv-grid stagger">
      <div class="mvv-card"><span class="mvv-label">[ MISSÃO ]</span><h3>Levar gestão de qualidade ao varejo brasileiro.</h3><p>Tecnologia de gestão de alta qualidade ao pequeno e médio varejista brasileiro, com proximidade, honestidade e suporte humano — pra que ele venda mais, controle melhor e cresça com segurança.</p></div>
      <div class="mvv-card"><span class="mvv-label">[ VISÃO ]</span><h3>Ser referência no RS em 3 anos.</h3><p>Ser, em três anos, a revenda Zucchetti referência no Rio Grande do Sul, reconhecida pela qualidade do atendimento e pela retenção de clientes acima da média do mercado.</p></div>
      <div class="mvv-card"><span class="mvv-label">[ VALORES ]</span><h3>O que nos guia.</h3><ul><li>Proximidade</li><li>Honestidade</li><li>Compromisso</li><li>Qualidade</li><li>Crescimento conjunto</li><li>Trabalho de verdade</li></ul></div>
    </div>
  </section>

  <section class="slide bg-gradient grid-pattern" data-slide="5">
    <div class="slide-header"><div class="slide-title">expectativas</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger">
      <h2 class="slide-h1">O que eu espero <span class="accent">nos próximos 12 meses</span>.</h2>
      <p style="font-size:1.15rem;line-height:1.55;opacity:0.92;max-width:900px;margin-bottom:2vh;">Eu não quero construir uma empresa grande no primeiro ano. Quero construir uma empresa <strong style="color:var(--blue-light)">sólida</strong>.</p>
    </div>
    <div class="expectativas-grid stagger">
      <div class="expectativa"><div class="expectativa-num">01</div><div class="expectativa-text">Conquistar os primeiros <strong>50 clientes ativos</strong>, com retenção alta e zero arrependimento.</div></div>
      <div class="expectativa"><div class="expectativa-num">02</div><div class="expectativa-text">Construir <strong>reputação local</strong> como a revenda que mais resolve no Rio Grande do Sul.</div></div>
      <div class="expectativa"><div class="expectativa-num">03</div><div class="expectativa-text">Ter um <strong>caixa saudável</strong> que permita investir em crescimento sem dívidas.</div></div>
      <div class="expectativa"><div class="expectativa-num">04</div><div class="expectativa-text"><strong>Pagar pró-labore justo</strong> pros dois sócios assim que o faturamento permitir.</div></div>
      <div class="expectativa"><div class="expectativa-num">05</div><div class="expectativa-text">Ter <strong>processos claros</strong>, pra escalar sem perder qualidade.</div></div>
    </div>
  </section>

  <section class="slide bg-white grid-pattern-dark" data-slide="6">
    <div class="slide-header"><div class="slide-title">stack_pronta</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">Tudo que está <span class="accent">pronto pra começar</span>.</h2></div>
    <div class="build-grid stagger">
      <div class="build-card"><span class="build-tag">[ SITE ]</span><div class="build-title">Landing page completa</div><div class="build-body">doisbsistemas.com.br · Identidade visual própria · Hero, problemas, vantagens, planos, FAQ, comparativo, CTAs. 100% responsivo.</div></div>
      <div class="build-card"><span class="build-tag">[ CHECKOUT ]</span><div class="build-title">Cadastro e pagamento</div><div class="build-body">Cartão de crédito, boleto e PIX (ativo a partir de junho/26) via Stripe. Webhook idempotente que libera acesso após confirmação.</div></div>
      <div class="build-card"><span class="build-tag">[ COBRANÇA ]</span><div class="build-title">Renovação automática</div><div class="build-body">Cron job diário que gera cobrança PIX recorrente, envia lembrete por e-mail e renova o acesso após pagamento confirmado.</div></div>
      <div class="build-card"><span class="build-tag">[ PAINEL ]</span><div class="build-title">Admin completo</div><div class="build-body">Clientes, chamados, tutoriais, documentos, chat com IA, captação de leads via Google Places e funil kanban com 9 etapas.</div></div>
      <div class="build-card"><span class="build-tag">[ E-MAILS ]</span><div class="build-title">9 fluxos automatizados</div><div class="build-body">Boas-vindas, acesso liberado, falha de pagamento, chamados, cobrança mensal e notificações internas — via Resend.</div></div>
      <div class="build-card"><span class="build-tag">[ INFRA ]</span><div class="build-title">Stack moderna</div><div class="build-body">Next.js 14 + TypeScript · Supabase · Stripe · Resend · Vercel · Domínio próprio com SSL · Deploy automático no GitHub.</div></div>
    </div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="7">
    <div class="slide-header"><div class="slide-title">planos_e_precos</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger">
      <h2 class="slide-h1">O que <span class="accent">vendemos</span>.</h2>
      <p style="opacity:0.78;font-size:16px;margin-bottom:2vh;font-family:var(--font-mono);">// ticket médio estimado: R$ 195/mês</p>
    </div>
    <div class="planos-grid stagger">
      <div class="plano-card"><div class="plano-name">[ Plano 01 ]</div><div class="plano-titulo">Essencial</div><div class="plano-preco">R$129,90</div><div class="plano-preco-suffix">/mês</div><div class="plano-desc">Pra quem está começando. Cadastros + Nota Fiscal + Orçamento. 1 usuário.</div></div>
      <div class="plano-card destaque"><span class="plano-badge">★ MAIS POPULAR</span><div class="plano-name">[ Plano 02 ]</div><div class="plano-titulo">Standard</div><div class="plano-preco">R$199,90</div><div class="plano-preco-suffix">/mês</div><div class="plano-desc">A escolha da maioria. PDV completo + Controle financeiro + Boletos + MDF-e. 3 usuários.</div></div>
      <div class="plano-card"><div class="plano-name">[ Plano 03 ]</div><div class="plano-titulo">Premium</div><div class="plano-preco">R$249,90</div><div class="plano-preco-suffix">/mês</div><div class="plano-desc">Pra escalar. Tudo + OS + Retaguarda offline + SPED + Grades. Usuários ilimitados.</div></div>
    </div>
  </section>

  <section class="slide bg-blue grid-pattern" data-slide="8">
    <div class="slide-header"><div class="slide-title">divisao_de_trabalho</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">Quem faz <span class="accent">o quê</span>.</h2></div>
    <div class="divisao-grid stagger">
      <div class="divisao-card">
        <div class="divisao-name">[ socia_01 ]</div><div class="divisao-papel">Laisa Barth</div>
        <ul class="divisao-list">
          <li><strong>Marketing digital</strong> <span>— anúncios Meta e Google</span></li>
          <li><strong>Conteúdo orgânico</strong> <span>— Instagram, posts, vídeos</span></li>
          <li><strong>Captação online</strong> <span>— funil de leads no painel</span></li>
          <li><strong>Suporte técnico</strong> <span>— chamados via painel</span></li>
          <li><strong>Manutenção do sistema</strong> <span>— site, painel, integrações</span></li>
          <li><strong>Onboarding técnico</strong> <span>— liberação de acesso, treinamentos</span></li>
        </ul>
      </div>
      <div class="divisao-card">
        <div class="divisao-name">[ socio_02 ]</div><div class="divisao-papel">Abel Barth</div>
        <ul class="divisao-list">
          <li><strong>Captação presencial</strong> <span>— visitas ao comércio local</span></li>
          <li><strong>Atendimento via WhatsApp</strong> <span>— leads quentes e clientes</span></li>
          <li><strong>Suporte ao cliente via WhatsApp</strong> <span>— dúvidas e urgências</span></li>
          <li><strong>Relacionamento com fornecedor</strong> <span>— Zucchetti e atualizações</span></li>
          <li><strong>Negociação comercial</strong> <span>— fechamento e renovações</span></li>
        </ul>
      </div>
    </div>
    <div style="margin-top:2vh;font-family:var(--font-mono);font-size:13px;opacity:0.85;text-align:center;">// Princípio: ninguém fica esperando. Lead chegou? É de quem está disponível.</div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="9">
    <div class="slide-header"><div class="slide-title">investimento_mensal</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1"><span class="accent">R$ 1.000/mês</span> nos primeiros 3 meses.</h2></div>
    <div class="invest-grid stagger">
      <div class="invest-card">
        <div class="invest-tag">[ MÊS 01 — ESTRUTURAÇÃO DA MARCA ]</div><div class="invest-title">Marca presente + testes de anúncios</div>
        <div class="invest-line"><span>Uniformes com logo</span><span class="valor">R$ 350,00</span></div>
        <div class="invest-line"><span>Cartões de visita + flyers</span><span class="valor">R$ 200,00</span></div>
        <div class="invest-line"><span>Meta Ads (Instagram + Facebook)</span><span class="valor">R$ 250,00</span></div>
        <div class="invest-line"><span>Google Ads</span><span class="valor">R$ 200,00</span></div>
        <div class="invest-line total"><span>TOTAL</span><span class="valor">R$ 1.000,00</span></div>
      </div>
      <div class="invest-card">
        <div class="invest-tag">[ MÊS 02 E 03 — 100% EM ANÚNCIOS ]</div><div class="invest-title">Verba migra integralmente pra mídia paga</div>
        <div class="invest-line"><span>Google Ads (Search + Local)</span><span class="valor">R$ 600,00</span></div>
        <div class="invest-line"><span>Meta Ads (Instagram + Facebook)</span><span class="valor">R$ 400,00</span></div>
        <div class="invest-line total"><span>TOTAL</span><span class="valor">R$ 1.000,00</span></div>
        <div style="margin-top:14px;font-size:12.5px;opacity:0.7;line-height:1.5;font-family:var(--font-mono);">// Mês 03: redistribuir 60/40 ou 50/50 com base no canal que estiver convertendo melhor.</div>
      </div>
      <div class="invest-rationale"><strong>Por que 60% Google e 40% Meta?</strong> &nbsp;Google captura <em>intenção de compra</em>. Meta captura <em>descoberta</em>. Em B2B varejo, Google tende a ter CAC mais baixo no início — mas Meta é essencial pra construir marca. Após o mês 2, a gente segue os dados.</div>
    </div>
  </section>

  <section class="slide bg-gradient grid-pattern" data-slide="10">
    <div class="slide-header"><div class="slide-title">estrategia_de_anuncios</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">Como vamos <span class="accent">anunciar</span>.</h2></div>
    <div class="ads-grid stagger">
      <div class="ads-col">
        <div class="ads-platform">[ GOOGLE ADS ]</div><div class="ads-name">Alta intenção</div>
        <div class="ads-sub">Search</div><ul><li>"sistema de gestão para [segmento]"</li><li>"PDV para varejo"</li><li>"ERP varejo Porto Alegre / RS"</li><li>"emissão NFCe / NFe"</li><li>"sistema com retaguarda offline"</li><li>"sistema para ordem de serviço"</li></ul>
        <div class="ads-sub">Foco geográfico</div><ul><li>Rio Grande do Sul nos 3 primeiros meses</li></ul>
      </div>
      <div class="ads-col">
        <div class="ads-platform">[ META ADS ]</div><div class="ads-name">Descoberta + marca</div>
        <div class="ads-sub">Públicos</div><ul><li>Frio: donos de pequenos negócios (28-60 anos, RS)</li><li>Quente: visitantes do site (retargeting 30d)</li><li>Lookalike: clientes ativos (a partir do mês 2)</li></ul>
        <div class="ads-sub">Criativos</div><ul><li>Carrossel "Sem ZWeb x Com ZWeb"</li><li>Vídeo curto com nós dois (humaniza marca)</li><li>Print do sistema (NFC-e em 3 cliques)</li><li>Depoimento — após primeiro cliente</li></ul>
      </div>
      <div class="ads-col">
        <div class="ads-platform">[ ORGÂNICO ]</div><div class="ads-name">Conteúdo + autoridade</div>
        <div class="ads-sub">Instagram</div><ul><li>@doisbsistemas — 4 posts/semana</li></ul>
        <div class="ads-sub">LinkedIn</div><ul><li>1 post/semana — posicionamento técnico</li></ul>
        <div class="ads-sub">YouTube Shorts</div><ul><li>2 vídeos/semana — tutoriais curtos do ZWeb</li></ul>
        <div class="ads-sub">Google Meu Negócio</div><ul><li>Postagens semanais + avaliações dos clientes</li></ul>
      </div>
    </div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="11">
    <div class="slide-header"><div class="slide-title">metas_q1</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">Onde queremos <span class="accent">chegar</span>.</h2></div>
    <div class="metas-wrapper stagger">
      <div class="metas-premissas">// <strong>Premissas:</strong> ticket médio R$195/mês · conversão lead→cliente 3% a 6% · captação presencial 15-25 visitas/mês · captação online 30-60 leads/mês</div>
      <div class="metas-grid">
        <div class="meta-mes">
          <div class="meta-mes-num">[ MÊS 01 ]</div><div class="meta-mes-titulo">Validação</div>
          <div class="meta-row meta-header"><span class="label">indicador</span><span class="v1">conservador</span><span class="v2">otimista</span></div>
          <div class="meta-row"><span class="label">Novos clientes</span><span class="v1">3</span><span class="v2">5</span></div>
          <div class="meta-row"><span class="label">Faturamento</span><span class="v1">R$ 585</span><span class="v2">R$ 975</span></div>
          <div class="meta-row"><span class="label">Leads gerados</span><span class="v1">30</span><span class="v2">50</span></div>
          <div style="margin-top:12px;font-size:12px;opacity:0.7;font-family:var(--font-mono);">// Objetivo real: APRENDER.</div>
        </div>
        <div class="meta-mes">
          <div class="meta-mes-num">[ MÊS 02 ]</div><div class="meta-mes-titulo">Crescimento</div>
          <div class="meta-row meta-header"><span class="label">indicador</span><span class="v1">conservador</span><span class="v2">otimista</span></div>
          <div class="meta-row"><span class="label">Novos no mês</span><span class="v1">5</span><span class="v2">8</span></div>
          <div class="meta-row"><span class="label">Acumulado</span><span class="v1">8</span><span class="v2">13</span></div>
          <div class="meta-row"><span class="label">Faturamento</span><span class="v1">R$ 1.560</span><span class="v2">R$ 2.535</span></div>
          <div class="meta-row"><span class="label">Leads gerados</span><span class="v1">50</span><span class="v2">80</span></div>
        </div>
        <div class="meta-mes" style="background:rgba(110,185,231,0.08);border-color:var(--blue-light)">
          <div class="meta-mes-num">[ MÊS 03 ]</div><div class="meta-mes-titulo">Consolidação</div>
          <div class="meta-row meta-header"><span class="label">indicador</span><span class="v1">conservador</span><span class="v2">otimista</span></div>
          <div class="meta-row"><span class="label">Novos no mês</span><span class="v1">8</span><span class="v2">12</span></div>
          <div class="meta-row"><span class="label">Acumulado</span><span class="v1">16</span><span class="v2">25</span></div>
          <div class="meta-row"><span class="label">Faturamento</span><span class="v1">R$ 3.120</span><span class="v2">R$ 4.875</span></div>
          <div class="meta-row"><span class="label">Leads gerados</span><span class="v1">60</span><span class="v2">100</span></div>
        </div>
      </div>
      <div style="margin-top:2vh;padding:16px 20px;background:rgba(110,185,231,0.1);border-left:3px solid var(--blue-light);border-radius:6px;font-size:14px;line-height:1.5;">
        <strong style="color:var(--blue-light);font-family:var(--font-mono);font-size:11px;text-transform:uppercase;">▸ MARCO DO TRIMESTRE</strong><br>
        <span style="font-size:16px;"><strong>Conservador:</strong> 16 clientes · R$ 3.120/mês &nbsp;|&nbsp; <strong>Otimista:</strong> 25 clientes · R$ 4.875/mês</span>
      </div>
    </div>
  </section>

  <section class="slide bg-blue grid-pattern" data-slide="12">
    <div class="slide-header"><div class="slide-title">prolabore</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">Quando começamos <span class="accent">a tirar</span>.</h2></div>
    <div class="prolabore stagger" style="margin-top:2vh">
      <div>
        <div class="prolabore-regra"><div class="prolabore-regra-titulo">▸ REGRA ACORDADA</div><div class="prolabore-regra-texto">Só passamos a tirar pró-labore quando o faturamento mensal atingir <span style="color:var(--blue-light)">R$ 10.000</span>.</div></div>
        <div class="prolabore-detalhes">
          <p style="margin-bottom:12px">Até lá, <strong>tudo que entra é reinvestido</strong> em anúncios, ferramentas e reserva.</p>
          <p style="margin-bottom:12px">Com ticket médio de R$ 195, precisamos de aproximadamente <strong>52 clientes ativos</strong>.</p>
          <p><strong>Projeção:</strong> entre o 5º e 7º mês (otimista) ou entre o 8º e 10º mês (conservador).</p>
        </div>
      </div>
      <div class="prolabore-divisao">
        <div class="divisao-titulo">// Divisão do faturamento a partir de R$ 10k</div>
        <div class="divisao-line"><span>Pró-labore Laisa</span><span class="pct">20%</span><span class="valor">R$ 2.000</span></div>
        <div class="divisao-line"><span>Pró-labore Abel</span><span class="pct">20%</span><span class="valor">R$ 2.000</span></div>
        <div class="divisao-line"><span>Marketing e anúncios</span><span class="pct">25%</span><span class="valor">R$ 2.500</span></div>
        <div class="divisao-line"><span>Reserva / caixa</span><span class="pct">15%</span><span class="valor">R$ 1.500</span></div>
        <div class="divisao-line"><span>Impostos + contador</span><span class="pct">10%</span><span class="valor">R$ 1.000</span></div>
        <div class="divisao-line"><span>Custos operacionais</span><span class="pct">10%</span><span class="valor">R$ 1.000</span></div>
      </div>
    </div>
  </section>

  <section class="slide bg-black grid-pattern" data-slide="13">
    <div class="slide-header"><div class="slide-title">riscos_e_mitigacao</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">O que pode <span class="accent">dar errado</span> (e como nos preparamos).</h2></div>
    <div class="riscos-grid stagger">
      <table class="tech-table">
        <thead><tr><th style="width:45%">▸ Risco</th><th>▸ Mitigação</th></tr></thead>
        <tbody>
          <tr><td><strong>Anúncios não converterem no início</strong></td><td>Mês 1 é teste — orçamento baixo, vários criativos, ajuste rápido com base nos dados.</td></tr>
          <tr><td><strong>Cliente assinar e não pagar (boleto/PIX)</strong></td><td>Acesso só é liberado <em>após confirmação</em> do Stripe. Webhook idempotente.</td></tr>
          <tr><td><strong>Suporte sobrecarregar</strong></td><td>Chat com IA na base de conhecimento + tutoriais já em produção. Reduz volume de chamados.</td></tr>
          <tr><td><strong>Concorrência grande (Bling, Tiny, Omie)</strong></td><td>Nosso diferencial é <em>atendimento humano + ZWeb robusto</em>. Eles não atendem o pequeno varejista com proximidade.</td></tr>
          <tr><td><strong>Discordância entre sócios</strong></td><td>Reunião semanal de alinhamento (sexta-feira, 30 minutos). Decisões registradas.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="slide bg-white grid-pattern-dark" data-slide="14">
    <div class="slide-header"><div class="slide-title">primeiros_30_dias</div><div class="logo-mini"><span class="doisb-mini">DOISB</span><span class="sistemas-mini">&lt;SISTEMAS&gt;</span></div></div>
    <div class="stagger"><h2 class="slide-h1">O plano dos <span class="accent">primeiros 30 dias</span>.</h2></div>
    <div class="timeline stagger">
      <div class="timeline-week"><div class="timeline-dot"></div><div class="timeline-num">[ SEMANA 01 ]</div><div class="timeline-titulo">Estruturar</div><ul><li>Encomendar uniformes, cartões e flyers</li><li>Criar contas Meta Ads e Google Ads</li><li>Abrir Google Meu Negócio</li><li>Definir territórios de visita (Abel)</li></ul></div>
      <div class="timeline-week"><div class="timeline-dot"></div><div class="timeline-num">[ SEMANA 02 ]</div><div class="timeline-titulo">Subir campanhas</div><ul><li>3 campanhas no Google (Search por segmento)</li><li>2 campanhas no Meta (1 fria, 1 retargeting)</li><li>Postar 4 conteúdos no Instagram</li><li>Abel: 5-10 visitas presenciais</li></ul></div>
      <div class="timeline-week"><div class="timeline-dot"></div><div class="timeline-num">[ SEMANA 03 ]</div><div class="timeline-titulo">Analisar</div><ul><li>Avaliar custo por lead e por clique</li><li>Ajustar criativos com pior performance</li><li>1ª reunião de revisão (sexta)</li></ul></div>
      <div class="timeline-week"><div class="timeline-dot"></div><div class="timeline-num">[ SEMANA 04 ]</div><div class="timeline-titulo">Consolidar</div><ul><li>Consolidar primeiros clientes (esperado: 1-3)</li><li>Pedir avaliação no Google</li><li>Planejar mês 02 com dados do mês 01</li></ul></div>
    </div>
  </section>

  <section class="slide bg-blue grid-pattern" data-slide="15">
    <div class="fechamento stagger">
      <div class="fechamento-frase">Pai, é hora <span class="blue">de começar</span>.</div>
      <div class="fechamento-list">&gt; O sistema está pronto.<br>&gt; O site está no ar.<br>&gt; A marca está construída.<br>&gt; O nosso plano está aqui.</div>
      <div style="font-size:clamp(18px,1.8vw,24px);opacity:0.95;max-width:900px;line-height:1.4;">Não vamos ser os maiores.<br>Vamos ser <strong style="color:var(--blue-light);font-weight:800">os melhores no que a gente atende</strong>.</div>
      <div class="fechamento-slogan">&lt;Venda. Controle. Cresça.&gt;</div>
      <div style="margin-top:1vh"><img src="/logos/doisb-color.png" alt="DoisB Sistemas" style="max-width:clamp(160px,20vw,280px);height:auto;filter:brightness(0) invert(1)"></div>
    </div>
  </section>

</div>

<div class="hud">
  <div class="hud-counter" id="counter">01 / 15</div>
  <div class="hud-nav">
    <button class="hud-btn" id="prevBtn" aria-label="Anterior">&#9664;</button>
    <button class="hud-btn" id="nextBtn" aria-label="Próximo">&#9654;</button>
  </div>
</div>

<script>
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let current = 0;
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const loader = document.getElementById('loader');
  function pad(n) { return n.toString().padStart(2, '0'); }
  function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    slides[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    counter.textContent = pad(current + 1) + ' / ' + pad(total);
    progressBar.style.width = ((current + 1) / total * 100) + '%';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(total - 1); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
        break;
    }
  });
  let touchStartX = 0;
  document.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', function(e) {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) { if (diff < 0) next(); else prev(); }
  });
  window.addEventListener('load', function() {
    slides[0].classList.add('active');
    counter.textContent = '01 / ' + pad(total);
    progressBar.style.width = (1 / total * 100) + '%';
    prevBtn.disabled = true;
    setTimeout(function() { loader.classList.add('hidden'); }, 300);
  });
</script>
</body>
</html>`

export async function GET() {
  const { response } = await requireAdmin()
  if (response) return response

  return new Response(HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
