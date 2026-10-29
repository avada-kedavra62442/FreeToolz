import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { homeMarkup, toolsMarkup } from './content.js';

function usePageInteractions(isDirectory) {
  useEffect(() => {
    document.body.classList.toggle('directory-page', isDirectory);
    document.title = isDirectory ? 'Explore all tools — FreeToolz' : 'FreeToolz — Useful software. Without the nonsense.';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://free-toolz.vercel.app${isDirectory ? '/tools/' : '/'}`;
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const onToggle = () => { if (!toggle || !nav) return; const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); };
    toggle?.addEventListener('click', onToggle);
    const closeNav = () => { nav?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); };
    nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
    const revealTargets = document.querySelectorAll('.principle-card,.category-card,.steps-grid article,.tool-card,.cta-card');
    let observer;
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealTargets.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; el.style.transition = 'opacity .5s ease, transform .5s ease'; });
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; observer.unobserve(entry.target); } }), { threshold: .08 });
      revealTargets.forEach(el => observer.observe(el));
    }
    let activeCategory = 'All';
    const grid = document.querySelector('#tools-grid'), cards = grid ? [...grid.querySelectorAll('.tool-card')] : [];
    const search = document.querySelector('#tool-search'), chips = [...document.querySelectorAll('.filter-chip')];
    const count = document.querySelector('#results-count'), empty = document.querySelector('#empty-state');
    const params = new URLSearchParams(window.location.search), requested = params.get('category');
    if (requested && chips.some(chip => chip.dataset.filter === requested)) activeCategory = requested;
    const applyFilters = () => {
      const q = (search?.value || '').trim().toLowerCase(); let visible = 0;
      cards.forEach(card => { const haystack = [card.dataset.name, card.dataset.category, card.dataset.search, card.textContent].join(' ').toLowerCase(); const match = (activeCategory === 'All' || card.dataset.category === activeCategory) && (!q || haystack.includes(q)); card.hidden = !match; if (match) visible++; });
      if (count) count.textContent = visible + ' ' + (visible === 1 ? 'tool' : 'tools');
      if (empty) empty.hidden = visible !== 0;
      chips.forEach(chip => { const selected = chip.dataset.filter === activeCategory; chip.classList.toggle('selected', selected); chip.setAttribute('aria-pressed', String(selected)); });
    };
    const chipHandlers = chips.map(chip => { const handler = () => { activeCategory = chip.dataset.filter; const next = new URL(window.location.href); if (activeCategory === 'All') next.searchParams.delete('category'); else next.searchParams.set('category', activeCategory); window.history.replaceState({}, '', next); applyFilters(); }; chip.addEventListener('click', handler); return [chip, handler]; });
    const searchHandler = () => applyFilters(); search?.addEventListener('input', searchHandler);
    const clear = document.querySelector('#clear-search');
    const clearHandler = () => { activeCategory = 'All'; if (search) search.value = ''; window.history.replaceState({}, '', window.location.pathname); applyFilters(); search?.focus(); };
    clear?.addEventListener('click', clearHandler); applyFilters();
    return () => {
      toggle?.removeEventListener('click', onToggle); nav?.querySelectorAll('a').forEach(a => a.removeEventListener('click', closeNav)); observer?.disconnect();
      chipHandlers.forEach(([chip, handler]) => chip.removeEventListener('click', handler)); search?.removeEventListener('input', searchHandler); clear?.removeEventListener('click', clearHandler); document.body.classList.remove('directory-page');
    };
  }, [isDirectory]);
}
function HomePage() { usePageInteractions(false); return <div className="app-content">{parse(homeMarkup)}</div>; }
function ToolsPage() { usePageInteractions(true); return <div className="app-content">{parse(toolsMarkup)}</div>; }
export default function App() { const path = window.location.pathname.replace(/\/+$/, '') || '/'; return path === '/tools' ? <ToolsPage /> : <HomePage />; }
