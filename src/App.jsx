import React, { useMemo, useState } from "react";

const FREEPDF_URL = "https://free-pdf-delta.vercel.app/";

const categories = [
  {
    id: "pdf",
    number: "01",
    name: "FreePDF",
    label: "PDF & Documents",
    description:
      "Merge, split, compress, convert and manage documents directly in your browser.",
    icon: "▣",
    featured: true,
    url: FREEPDF_URL,
    tools: [
      "Merge PDF",
      "Split PDF",
      "Compress PDF",
      "Extract Pages",
      "Rotate Pages",
      "PDF → Image",
    ],
  },
  {
    id: "image",
    number: "02",
    name: "FreeImage",
    label: "Images",
    description:
      "Resize, crop, convert, optimize and work with images without unnecessary uploads.",
    icon: "◈",
    tools: [
      "Resize Image",
      "Compress Image",
      "Crop Image",
      "Convert Image",
      "Remove Background",
      "Image → PDF",
    ],
  },
  {
    id: "video",
    number: "03",
    name: "FreeVideo",
    label: "Video",
    description:
      "Simple browser-first tools for everyday video conversion and editing.",
    icon: "▶",
    tools: [
      "Trim Video",
      "Convert Video",
      "Compress Video",
      "Extract Audio",
      "Resize Video",
      "Video → GIF",
    ],
  },
  {
    id: "convert",
    number: "04",
    name: "FreeConvert",
    label: "Conversion",
    description:
      "Convert common files between formats with a clean, focused workflow.",
    icon: "↔",
    tools: [
      "File Converter",
      "Document Converter",
      "Image Converter",
      "Audio Converter",
      "Video Converter",
      "Unit Converter",
    ],
  },
  {
    id: "qr",
    number: "05",
    name: "FreeQR",
    label: "QR & Codes",
    description:
      "Create useful QR codes quickly, without accounts, subscriptions or clutter.",
    icon: "⌗",
    tools: [
      "QR Generator",
      "URL QR",
      "Text QR",
      "Wi-Fi QR",
      "Email QR",
      "Contact QR",
    ],
  },
  {
    id: "color",
    number: "06",
    name: "FreeColor",
    label: "Color",
    description:
      "Explore, pick, convert and work with colors for design and development.",
    icon: "✦",
    tools: [
      "Color Picker",
      "HEX Converter",
      "RGB Converter",
      "Palette Generator",
      "Gradient Generator",
      "Contrast Checker",
    ],
  },
  {
    id: "ocr",
    number: "07",
    name: "FreeOCR",
    label: "Text & OCR",
    description:
      "Turn images and scanned documents into usable text wherever browser processing allows.",
    icon: "Aa",
    tools: [
      "Image → Text",
      "Scan → Text",
      "PDF → Text",
      "Text Cleanup",
      "Case Converter",
      "Word Counter",
    ],
  },
  {
    id: "compress",
    number: "08",
    name: "FreeCompress",
    label: "Compression",
    description:
      "Reduce file sizes while keeping your workflow simple and transparent.",
    icon: "⇣",
    tools: [
      "Compress PDF",
      "Compress Image",
      "Compress Video",
      "Compress Files",
      "Optimize Assets",
      "Size Analyzer",
    ],
  },
  {
    id: "web",
    number: "09",
    name: "FreeWeb",
    label: "Web",
    description:
      "Small but powerful utilities for websites, URLs, text and everyday web work.",
    icon: "⌁",
    tools: [
      "URL Encoder",
      "URL Decoder",
      "HTML Formatter",
      "Meta Generator",
      "Slug Generator",
      "QR from URL",
    ],
  },
  {
    id: "dev",
    number: "10",
    name: "FreeDev",
    label: "Developer",
    description:
      "Fast browser-based utilities for developers, students and builders.",
    icon: "</>",
    tools: [
      "JSON Formatter",
      "JSON Validator",
      "Base64",
      "JWT Decoder",
      "Regex Tester",
      "Timestamp Converter",
    ],
  },
  {
    id: "life",
    number: "11",
    name: "FreeLife",
    label: "Everyday",
    description:
      "Practical utilities for planning, calculations, writing and everyday digital tasks.",
    icon: "◇",
    tools: [
      "Calculator",
      "Timer",
      "Date Calculator",
      "Age Calculator",
      "Text Tools",
      "Checklist",
    ],
  },
];

const quickTools = [
  {
    name: "Merge PDF",
    category: "FreePDF",
    url: FREEPDF_URL,
    icon: "＋",
  },
  {
    name: "Split PDF",
    category: "FreePDF",
    url: FREEPDF_URL,
    icon: "╱",
  },
  {
    name: "Compress PDF",
    category: "FreePDF",
    url: FREEPDF_URL,
    icon: "⇣",
  },
  {
    name: "Image Tools",
    category: "FreeImage",
    url: "#image",
    icon: "◈",
  },
  {
    name: "QR Generator",
    category: "FreeQR",
    url: "#qr",
    icon: "⌗",
  },
  {
    name: "JSON Formatter",
    category: "FreeDev",
    url: "#dev",
    icon: "</>",
  },
];

function Arrow() {
  return <span className="arrow">↗</span>;
}

function GlassIcon({ children }) {
  return <span className="glass-icon">{children}</span>;
}

function App() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    const matches = [];

    categories.forEach((category) => {
      if (
        category.name.toLowerCase().includes(query) ||
        category.label.toLowerCase().includes(query)
      ) {
        matches.push({
          name: category.name,
          category: category.label,
          url: category.url || `#${category.id}`,
          icon: category.icon,
        });
      }

      category.tools.forEach((tool) => {
        if (tool.toLowerCase().includes(query)) {
          matches.push({
            name: tool,
            category: category.name,
            url: category.url || `#${category.id}`,
            icon: category.icon,
          });
        }
      });
    });

    return matches.slice(0, 8);
  }, [search]);

  const scrollToTools = () => {
    document
      .getElementById("tools")
      ?.scrollIntoView({ behavior: "smooth" });

    setMobileOpen(false);
  };

  const scrollToAbout = () => {
    document
      .getElementById("why")
      ?.scrollIntoView({ behavior: "smooth" });

    setMobileOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="navbar">
        <a href="/" className="brand" aria-label="FreeToolz home">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>

          <span className="brand-word">
            Free<span>Toolz</span>
          </span>
        </a>

        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <button onClick={scrollToTools}>Tools</button>
          <button onClick={scrollToAbout}>Why FreeToolz</button>

          <a href={FREEPDF_URL}>FreePDF</a>

          <a
            className="nav-cta"
            href="#tools"
            onClick={() => setMobileOpen(false)}
          >
            Explore
            <Arrow />
          </a>
        </nav>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              THE FREE DIGITAL TOOLBOX
            </div>

            <h1>
              Powerful tools.
              <br />
              <span>Zero nonsense.</span>
            </h1>

            <p className="hero-description">
              FreeToolz is a growing collection of useful digital tools for
              PDFs, images, video, conversion, development and everyday life.
              Built to be simple. Designed to be beautiful. Free to use.
            </p>

            <div className="hero-actions">
              <button className="button-primary" onClick={scrollToTools}>
                Explore the toolbox
                <Arrow />
              </button>

              <a className="button-secondary" href={FREEPDF_URL}>
                Open FreePDF
                <Arrow />
              </a>
            </div>

            <div className="hero-proof">
              <div>
                <strong>11</strong>
                <span>Tool families</span>
              </div>

              <div className="proof-line" />

              <div>
                <strong>∞</strong>
                <span>Ideas to build</span>
              </div>

              <div className="proof-line" />

              <div>
                <strong>$0</strong>
                <span>To get started</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="toolbox-glass">
              <div className="toolbox-top">
                <span>FREETOOLZ</span>
                <span>01 / 11</span>
              </div>

              <div className="toolbox-center">
                <div className="toolbox-symbol">
                  <span>F</span>
                </div>

                <div>
                  <small>THE TOOLBOX</small>
                  <h2>Make it simple.</h2>
                </div>
              </div>

              <div className="toolbox-grid">
                <div>
                  <strong>PDF</strong>
                  <span>Documents</span>
                </div>

                <div>
                  <strong>IMG</strong>
                  <span>Images</span>
                </div>

                <div>
                  <strong>DEV</strong>
                  <span>Code</span>
                </div>

                <div>
                  <strong>WEB</strong>
                  <span>Internet</span>
                </div>
              </div>

              <div className="toolbox-bottom">
                <span>USEFUL BY DESIGN</span>
                <span className="status">
                  <i /> ONLINE
                </span>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <GlassIcon>▣</GlassIcon>
              <div>
                <strong>FreePDF</strong>
                <span>Documents made simple</span>
              </div>
              <Arrow />
            </div>

            <div className="floating-card floating-card-two">
              <span className="mini-number">11</span>
              <div>
                <strong>Tool families</strong>
                <span>and growing</span>
              </div>
            </div>
          </div>
        </section>

        <section className="search-section">
          <div className="section-kicker">FIND YOUR TOOL</div>

          <div className="search-shell">
            <span className="search-icon">⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="What do you need to do?"
              aria-label="Search FreeToolz"
            />

            <span className="search-shortcut">SEARCH</span>

            {search.trim() && (
              <div className="search-results">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <a
                      href={result.url}
                      className="search-result"
                      key={`${result.name}-${index}`}
                    >
                      <span className="result-icon">
                        {result.icon}
                      </span>

                      <span>
                        <strong>{result.name}</strong>
                        <small>{result.category}</small>
                      </span>

                      <Arrow />
                    </a>
                  ))
                ) : (
                  <div className="no-results">
                    No tool found yet — we're still building.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="quick-section">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">QUICK ACCESS</span>
              <h2>Start with something useful.</h2>
            </div>
          </div>

          <div className="quick-grid">
            {quickTools.map((tool) => (
              <a
                href={tool.url}
                className="quick-card"
                key={tool.name}
              >
                <span className="quick-icon">{tool.icon}</span>

                <div>
                  <strong>{tool.name}</strong>
                  <span>{tool.category}</span>
                </div>

                <Arrow />
              </a>
            ))}
          </div>
        </section>

        <section className="tools-section" id="tools">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE TOOLBOX</span>

              <h2>
                Everything useful,
                <br />
                <span>in one place.</span>
              </h2>
            </div>

            <p>
              One growing ecosystem. Eleven tool families. A simple goal:
              make useful things easier to do.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article
                className={`category-card ${
                  category.featured ? "featured" : ""
                }`}
                id={category.id}
                key={category.id}
              >
                <div className="category-top">
                  <span className="category-number">
                    {category.number}
                  </span>

                  <span className="category-icon">
                    {category.icon}
                  </span>
                </div>

                <div className="category-body">
                  <span className="category-label">
                    {category.label}
                  </span>

                  <h3>{category.name}</h3>

                  <p>{category.description}</p>
                </div>

                <div className="category-tools">
                  {category.tools.slice(0, 4).map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

                {category.featured ? (
                  <a
                    className="category-button"
                    href={category.url}
                  >
                    Open FreePDF
                    <Arrow />
                  </a>
                ) : (
                  <a
                    className="category-button"
                    href={`#${category.id}`}
                    onClick={(event) => event.preventDefault()}
                  >
                    Coming to FreeToolz
                    <Arrow />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="principles-section" id="why">
          <div className="principles-panel">
            <div className="principles-intro">
              <span className="section-kicker">
                THE FREETOOLZ PRINCIPLE
              </span>

              <h2>
                Free should
                <br />
                <span>mean free.</span>
              </h2>

              <p>
                We are building FreeToolz around a straightforward idea:
                useful digital utilities should not need to become complicated
                just because they are useful.
              </p>
            </div>

            <div className="principles-list">
              <div className="principle">
                <span>01</span>

                <div>
                  <h3>$0 to start</h3>
                  <p>
                    The goal is a toolbox people can actually use without a
                    subscription wall.
                  </p>
                </div>
              </div>

              <div className="principle">
                <span>02</span>

                <div>
                  <h3>Browser first</h3>
                  <p>
                    Whenever practical, tools should process work directly in
                    the browser instead of sending it somewhere unnecessarily.
                  </p>
                </div>
              </div>

              <div className="principle">
                <span>03</span>

                <div>
                  <h3>No nonsense</h3>
                  <p>
                    No artificial clutter. No confusing funnels. Just the
                    utility you came for.
                  </p>
                </div>
              </div>

              <div className="principle">
                <span>04</span>

                <div>
                  <h3>Designed properly</h3>
                  <p>
                    Free does not have to look cheap. Every FreeToolz product
                    should feel polished, fast and intentional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="featured-card">
            <div className="featured-glow" />

            <div className="featured-copy">
              <span className="section-kicker">
                FIRST IN THE TOOLBOX
              </span>

              <h2>
                Meet
                <br />
                <span>FreePDF.</span>
              </h2>

              <p>
                The first FreeToolz product is already live. Merge PDFs today,
                with more document tools joining the workspace.
              </p>

              <a
                href={FREEPDF_URL}
                className="button-primary"
              >
                Open FreePDF
                <Arrow />
              </a>
            </div>

            <div className="pdf-showcase">
              <div className="pdf-window">
                <div className="window-top">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="pdf-content">
                  <div className="pdf-badge">PDF</div>

                  <div className="pdf-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="pdf-pages">
                    <span>01</span>
                    <span>02</span>
                    <span>03</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div className="final-orb" />

          <span className="section-kicker">
            THE TOOLBOX IS OPEN
          </span>

          <h2>
            Stop hunting.
            <br />
            <span>Start using.</span>
          </h2>

          <p>
            One place for the little digital jobs that should never have been
            difficult.
          </p>

          <button
            className="button-primary large"
            onClick={scrollToTools}
          >
            Explore FreeToolz
            <Arrow />
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="/" className="brand">
              <span className="brand-mark">
                <span />
                <span />
                <span />
              </span>

              <span className="brand-word">
                Free<span>Toolz</span>
              </span>
            </a>

            <p>
              Useful tools.
              <br />
              No nonsense.
            </p>
          </div>

          <div className="footer-column">
            <span>TOOLS</span>

            <a href="#tools">All Tools</a>
            <a href={FREEPDF_URL}>FreePDF</a>
            <a href="#image">FreeImage</a>
            <a href="#dev">FreeDev</a>
          </div>

          <div className="footer-column">
            <span>EXPLORE</span>

            <button onClick={scrollToTools}>Toolbox</button>
            <button onClick={scrollToAbout}>Why FreeToolz</button>
            <a href="#tools">Coming Soon</a>
          </div>

          <div className="footer-column">
            <span>FREEPDF</span>

            <a href={FREEPDF_URL}>Open FreePDF</a>
            <a href={`${FREEPDF_URL}#tools`}>PDF Workspace</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FreeToolz</span>

          <span>
            Built for useful things.
          </span>

          <span>FREE / SIMPLE / USEFUL</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
