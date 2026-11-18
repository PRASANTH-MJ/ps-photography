#!/usr/bin/env python3
"""Builds the PS Photography pages from src/.

Edit files in src/ (shared parts are below in this file), then run:
    python3 build.py
The finished pages (index.html, shoots.html, ...) are written to this folder.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SEC = ROOT / "src" / "sections"
PHONE = "+91 98765 43210"
WA = "919876543210"


def sec(name):
    return (SEC / f"{name}.html").read_text()


NAV = [
    ("index.html", "Home"),
    ("shoots.html", "Shoots"),
    ("portfolio.html", "Portfolio"),
    ("albums.html", "Albums & frames"),
    ("packages.html", "Packages"),
]

LOGO = """<svg class="logo-mark" viewBox="0 0 44 44" aria-hidden="true">
  <circle cx="22" cy="22" r="20.5" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <circle cx="22" cy="22" r="16.5" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="1.2 2.2"/>
  <text x="22" y="28.2" text-anchor="middle" font-family="Instrument Serif, serif" font-size="18" fill="currentColor">PS</text>
  <circle cx="35.5" cy="8.5" r="3" fill="#E9A21B"/>
</svg>"""


def head(title, desc, extra=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<script>document.documentElement.classList.add("js")</script>
{extra}</head>
<body>
"""


def header(active):
    cur = ' aria-current="page"'
    links = "\n".join(
        f'    <a href="{href}"{cur if href == active else ""}>{label}</a>'
        for href, label in NAV
    )
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <a href="index.html" class="brand" aria-label="PS Photography home">
    {LOGO}<span>PS Photography</span>
  </a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">Menu</button>
  <nav id="nav-links" class="nav-links" aria-label="Main">
{links}
    <a href="contact.html" class="nav-cta"{cur if active == "contact.html" else ""}>Book a date</a>
  </nav>
</header>
"""


def page_head(crumb, title, intro, img, alt, frame_no):
    return f"""<section class="page-head">
  <div class="page-head-text">
    <p class="crumbs"><a href="index.html">Home</a><span aria-hidden="true">/</span>{crumb}</p>
    <h1>{title}</h1>
    <p class="page-intro">{intro}</p>
  </div>
  <figure class="page-head-photo">
    <img src="images/{img}" alt="{alt}">
    <span class="frame-no">{frame_no}</span>
  </figure>
</section>
"""


CTA = f"""<section class="cta-band">
  <div class="cta-inner reveal">
    <h2>Check if your date is free</h2>
    <p>Send us the date and the kind of shoot. We reply within a few hours.</p>
    <div class="cta-actions">
      <a class="btn btn-light" href="contact.html">Book a date</a>
      <a class="btn btn-outline-light" href="https://wa.me/{WA}" target="_blank" rel="noopener">WhatsApp us</a>
    </div>
  </div>
</section>
"""

FOOTER = f"""<footer class="footer">
  <p class="footer-line">Your story, printed, framed and handed to you.</p>
  <div class="footer-cols">
    <div><a href="index.html" class="brand">{LOGO}<span>PS Photography</span></a><p>Wedding, pre-wedding, model and baby photography in Chennai.</p></div>
    <div><h3>Pages</h3><p><a href="shoots.html">Shoots</a><br><a href="portfolio.html">Portfolio</a><br><a href="albums.html">Albums &amp; frames</a><br><a href="packages.html">Packages</a></p></div>
    <div><h3>Visit</h3><p>12, 2nd Avenue, Anna Nagar<br>Chennai 600040<br>9 am – 9 pm, all days</p></div>
    <div><h3>Talk to us</h3><p><a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a><br><a href="mailto:hello@psphotography.in">hello@psphotography.in</a><br><a href="https://instagram.com/" rel="noopener">Instagram</a> &nbsp; <a href="https://youtube.com/" rel="noopener">YouTube</a></p></div>
  </div>
  <p class="footer-base">© <span class="js-year">2026</span> PS Photography. Sample photos used for preview.</p>
</footer>
"""


def tail(extra=""):
    return f"{FOOTER}\n{sec('wa')}{extra}<script src=\"script.js\"></script>\n</body>\n</html>\n"


# ---------------------------------------------------------------- home-only sections
HOME_INTRO = """<section class="intro">
  <div class="intro-text reveal">
    <h2>A Chennai studio for the days you'll want to remember.</h2>
    <p>PS Photography is a small team of photographers, filmmakers and album designers. We take a limited number of weddings each month, so the same lead photographer stays with you from the first call to the day you hold your album.</p>
    <p>Between weddings we shoot pre-wedding stories, model portfolios and newborns in our Anna Nagar studio.</p>
    <a class="text-link" href="shoots.html">See everything we shoot</a>
  </div>
  <div class="intro-photos reveal">
    <div class="develop tall"><img src="images/wedding-bouquet.jpg" alt="Bride holding a bouquet in soft light" loading="lazy"></div>
    <div class="develop short"><img src="images/baby-feet.jpg" alt="Newborn's feet in a white towel" loading="lazy"></div>
  </div>
</section>
"""

TILES = [
    ("wedding", "wedding-confetti.jpg", "Couple under falling confetti", "Wedding", "from ₹74,999"),
    ("prewedding", "prewed-lake.jpg", "Couple by a lake", "Pre-wedding", "from ₹24,999"),
    ("postwedding", "postwed-beach.jpg", "Couple on a beach", "Post-wedding", "from ₹24,999"),
    ("model", "model-blue.jpg", "Studio portrait in blue light", "Model portfolio", "from ₹12,999"),
    ("baby", "baby-float.jpg", "Baby on a swim ring", "Baby & newborn", "from ₹8,999"),
]
HOME_SHOOTS = """<section class="bento-wrap">
  <div class="section-head reveal">
    <h2>What we shoot</h2>
    <p>One team and one style, from your first photos as a couple to your baby's first month.</p>
  </div>
  <div class="bento">
""" + "\n".join(
    f"""    <a class="tile tile-{k} reveal" href="shoots.html#{k}">
      <img src="images/{img}" alt="{alt}" loading="lazy">
      <span class="tile-text"><span class="tile-name">{name.replace('&', '&amp;')}</span><span class="tile-price">{price}</span></span>
    </a>""" for k, img, alt, name, price in TILES
) + """
  </div>
</section>
"""

RECENT = ["wedding-aisle.jpg", "model-pink.jpg", "prewed-shadow.jpg", "baby-bear.jpg", "wedding-balloons.jpg", "model-golden.jpg", "rings-gold.jpg", "model-street.jpg"]
HOME_WORK = """<section class="recent">
  <div class="section-head reveal">
    <h2>Recent work</h2>
    <a class="text-link light" href="portfolio.html">See the full portfolio</a>
  </div>
  <div class="reel" tabindex="0" aria-label="Recent photos, scroll sideways">
""" + "\n".join(f'    <img src="images/{i}" alt="" loading="lazy">' for i in RECENT) + """
  </div>
</section>
"""

HOME_PRINT = """<section class="print-teaser">
  <div class="print-visual reveal" aria-hidden="true">
    <div class="mini-album"><span>Divya</span><em>&amp;</em><span>Karthik</span></div>
    <div class="mini-frame"><img src="images/prewed-shadow.jpg" alt="" loading="lazy"></div>
  </div>
  <div class="print-text reveal">
    <h2>Albums and frames, designed in our studio</h2>
    <p>Flip through a sample album, pick a leather or velvet cover, and try frames on a wall to see the real size before you order.</p>
    <a class="btn btn-primary" href="albums.html">Try albums and frames</a>
  </div>
</section>
"""

LD = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"PS Photography","image":"images/hero.jpg","telephone":"+91 98765 43210","address":{"@type":"PostalAddress","streetAddress":"12, 2nd Avenue, Anna Nagar","addressLocality":"Chennai","postalCode":"600040","addressCountry":"IN"},"priceRange":"₹₹","openingHours":"Mo-Su 09:00-21:00"}
</script>
"""

VISIT = f"""<section class="visit">
  <div class="visit-card reveal">
    <h2>Visit the studio</h2>
    <p>12, 2nd Avenue, Anna Nagar, Chennai 600040. Open 9 am to 9 pm, every day. Call ahead and we'll have sample albums and frames ready to look at.</p>
    <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=Anna+Nagar+Chennai" target="_blank" rel="noopener">Get directions</a>
  </div>
  <div class="visit-photo develop reveal"><img src="images/decor-aisle.jpg" alt="Flower-lined wedding aisle" loading="lazy"></div>
</section>
"""

PAGES = {
    "index.html": (
        "PS Photography | Wedding, Pre-wedding, Model & Baby Photography in Chennai",
        "Wedding, pre-wedding, post-wedding, model portfolio and baby photography in Chennai. Albums, frames and cinematic films. Book on WhatsApp.",
        lambda: sec("hero") + sec("marquee") + HOME_INTRO + HOME_SHOOTS + HOME_WORK + HOME_PRINT + sec("words") + CTA,
        LD, "",
    ),
    "shoots.html": (
        "Shoots | PS Photography Chennai",
        "Wedding, pre-wedding, post-wedding, model portfolio and baby & newborn shoots in Chennai, and how booking works.",
        lambda: page_head("Shoots", "What we shoot", "One team and one style, from your first photos as a couple to your baby's first month.", "wedding-confetti.jpg", "Couple kissing under falling confetti", "01A")
        + sec("shoots") + sec("process") + CTA,
        "", "",
    ),
    "portfolio.html": (
        "Portfolio | PS Photography Chennai",
        "Wedding, pre-wedding, model and baby photos by PS Photography, Chennai.",
        lambda: page_head("Portfolio", "Portfolio", "A selection from recent weddings, couple shoots, portfolios and newborn sessions. Filter by shoot, and tap any photo to see it larger.", "model-golden.jpg", "Golden-hour portrait", "07A")
        + sec("portfolio") + CTA,
        "", sec("lightbox"),
    ),
    "albums.html": (
        "Albums & Photo Frames | PS Photography Chennai",
        "Hand-bound wedding albums and photo frames. Flip through a sample album and preview frames to scale.",
        lambda: page_head("Albums &amp; frames", "Albums &amp; frames", "Every photo we take is meant to be printed. Turn the pages of a sample album, then try frames on a wall.", "wedding-hands.jpg", "Bride and groom's hands with rings", "12A")
        + sec("albums") + sec("frames") + CTA,
        "", "",
    ),
    "packages.html": (
        "Packages & Prices | PS Photography Chennai",
        "Photography package prices for weddings, pre-wedding, model portfolio and baby shoots in Chennai, plus common questions.",
        lambda: page_head("Packages", "Packages", "Starting prices. Every quote is fixed before you pay the advance, with no surprise charges later.", "wedding-balloons.jpg", "Couple at an outdoor reception", "18A")
        + sec("packages") + sec("process") + sec("faq") + CTA,
        "", "",
    ),
    "contact.html": (
        "Book a Date | PS Photography Chennai",
        "Check if your date is free. Book a wedding, pre-wedding, model or baby shoot with PS Photography on WhatsApp.",
        lambda: page_head("Book a date", "Book a date", f"Fill in the form and WhatsApp opens with your details ready to send. Or call us on {PHONE}.", "prewed-shadow.jpg", "Couple holding hands", "24A")
        + sec("book") + VISIT,
        "", "",
    ),
}

for fname, (title, desc, body, extra_head, extra_tail) in PAGES.items():
    html = head(title, desc, extra_head) + header(fname) + '<main id="main">\n' + body() + "</main>\n" + tail(extra_tail)
    (ROOT / fname).write_text(html)
    print("built", fname)
