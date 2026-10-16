
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Globe2,
  MapPin,
  Mountain,
  Orbit,
  Radio,
  Satellite,
  Zap,
} from "lucide-react";

const EarthGlobe = dynamic(
  () => import("./components/EarthGlobe"),
  { ssr: false }
);

type ISSData = {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  visibility?: string;
};

const ISS_API = "https://api.wheretheiss.at/v1/satellites/25544";

function formatCoordinate(value: number, direction: "lat" | "lon") {
  const suffix =
    direction === "lat"
      ? value >= 0 ? "N" : "S"
      : value >= 0 ? "E" : "W";

  return `${Math.abs(value).toFixed(3)}° ${suffix}`;
}

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        <Icon size={23} strokeWidth={1.6} />
      </div>
      <div className="min-w-0">
        <p className="micro-label">{label}</p>
        <p className="metric-value">{value}</p>
        {detail && <p className="metric-detail">{detail}</p>}
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  number,
}: {
  eyebrow: string;
  title: string;
  number: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="micro-label">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <span className="section-number">{number}</span>
    </div>
  );
}

export default function Home() {
  const [iss, setIss] = useState<ISSData | null>(null);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchISS = useCallback(async () => {
    try {
      const response = await fetch(ISS_API, { cache: "no-store" });
      if (!response.ok) throw new Error("ISS data unavailable");

      const data: ISSData = await response.json();
      setIss(data);
      setError(false);
      setLastUpdated(formatTime(data.timestamp));
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, [fetchISS]);

  const latitude = iss
    ? formatCoordinate(iss.latitude, "lat")
    : "Loading…";

  const longitude = iss
    ? formatCoordinate(iss.longitude, "lon")
    : "Loading…";

  const mapUrl = iss
    ? `https://www.openstreetmap.org/?mlat=${iss.latitude}&mlon=${iss.longitude}#map=3/${iss.latitude}/${iss.longitude}`
    : "https://www.openstreetmap.org/";

  return (
    <main>
      {/* NAVIGATION */}
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Orbital home">
          <span className="brand-mark">
            <Orbit size={34} strokeWidth={1.5} />
          </span>
          <span>
            <span className="brand-name">ORBITAL</span>
            <span className="brand-caption">ISS TRACKING SYSTEM</span>
          </span>
        </a>

        <nav className="main-nav">
          <a className="active" href="#home">Home</a>
          <a href="#mission-control">Mission Control</a>
          <a href="#telemetry">Telemetry</a>
          <a href="#tracking">Tracking</a>
          <a href="#about">About</a>
        </nav>

        <a className="live-pill" href="#telemetry">
          <span className="live-dot" />
          {error ? "Connection issue" : "Live tracking"}
        </a>
      </header>

      {/* HERO */}
      <section id="home" className="hero-section">
        <div className="hero-image" />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" />
              INTERNATIONAL SPACE STATION / ISS-25544
            </p>

            <h1>
              The ISS is
              <br />
              orbiting <span>Earth.</span>
            </h1>

            <p className="hero-description">
              Live tracking, real-time telemetry and a 3D view
              of the International Space Station as it travels
              around our planet.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#mission-control">
                Explore mission control
                <ArrowRight size={17} />
              </a>
              <a className="text-link" href="#tracking">
                View station position <ArrowDownRight size={16} />
              </a>
            </div>

            <div className="hero-bottom-data">
              <div>
                <span className="micro-label">ORBITAL ALTITUDE</span>
                <strong>{iss ? `${iss.altitude.toFixed(1)} km` : "—"}</strong>
              </div>
              <div>
                <span className="micro-label">ORBITAL VELOCITY</span>
                <strong>
                  {iss ? `${Math.round(iss.velocity * 3.6).toLocaleString()} km/h` : "—"}
                </strong>
              </div>
              <div>
                <span className="micro-label">ORBITAL PERIOD</span>
                <strong>~ 92 min</strong>
              </div>
            </div>
          </div>

          <aside className="hero-data-panel">
            <div className="panel-heading">
              <span>Live mission data</span>
              <Satellite size={17} />
            </div>

            <Metric
              icon={Mountain}
              label="Altitude"
              value={iss ? `${iss.altitude.toFixed(1)} km` : "Loading…"}
              detail="Above mean sea level"
            />
            <Metric
              icon={Gauge}
              label="Velocity"
              value={iss ? `${Math.round(iss.velocity * 3.6).toLocaleString()} km/h` : "Loading…"}
              detail="Current orbital speed"
            />
            <Metric
              icon={Orbit}
              label="Orbital period"
              value="~ 92 min"
              detail="One complete orbit"
            />
            <Metric
              icon={Eye}
              label="Visibility"
              value={iss?.visibility ?? "Tracking"}
              detail="Visibility varies by location"
            />
          </aside>
        </div>

        <div className="hero-coordinate">
          <Crosshair size={15} />
          <span>LIVE ORBITAL FEED</span>
          <span className="coordinate-divider" />
          <span>{iss ? `${iss.latitude.toFixed(2)}, ${iss.longitude.toFixed(2)}` : "ACQUIRING SIGNAL"}</span>
        </div>
      </section>

      {/* MISSION CONTROL / 3D EARTH */}
      <section id="mission-control" className="page-section mission-section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="01 / VISUALIZATION"
            title="Mission control"
            number="01 — 03"
          />

          <div className="mission-layout">
            <div className="earth-panel">
              <div className="earth-panel-top">
                <div>
                  <p className="micro-label">EARTH / LIVE VIEW</p>
                  <p className="panel-subtitle">Orbital position visualizer</p>
                </div>
                <span className="live-status">
                  <span className="live-dot" /> LIVE
                </span>
              </div>

              <div className="earth-stage">
                <div className="earth-decoration earth-ring-one" />
                <div className="earth-decoration earth-ring-two" />
                <div className="earth-globe-wrap">
                  <EarthGlobe
                    latitude={iss?.latitude ?? 0}
                    longitude={iss?.longitude ?? 0}
                  />
                </div>
                <div className="earth-axis-label axis-n">N</div>
                <div className="earth-axis-label axis-s">S</div>
                <div className="earth-orbit-label">
                  <Satellite size={15} /> ISS ORBIT
                </div>
              </div>

              <div className="earth-panel-bottom">
                <span><span className="legend-dot" /> Earth</span>
                <span><span className="legend-line" /> Orbital path concept</span>
                <span>3D VIEW</span>
              </div>
            </div>

            <aside id="telemetry" className="telemetry-panel">
              <div className="panel-heading">
                <div>
                  <p className="micro-label">LIVE DATA STREAM</p>
                  <h3>ISS telemetry</h3>
                </div>
                <span className="live-status">
                  <span className="live-dot" /> LIVE
                </span>
              </div>

              <div className="telemetry-list">
                <Metric
                  icon={Mountain}
                  label="Altitude"
                  value={iss ? `${iss.altitude.toFixed(2)} km` : "—"}
                />
                <Metric
                  icon={Gauge}
                  label="Velocity"
                  value={iss ? `${Math.round(iss.velocity * 3.6).toLocaleString()} km/h` : "—"}
                />
                <Metric
                  icon={Crosshair}
                  label="Latitude"
                  value={latitude}
                />
                <Metric
                  icon={Globe2}
                  label="Longitude"
                  value={longitude}
                />
              </div>

              <div className="update-row">
                <Clock3 size={16} />
                <div>
                  <p className="micro-label">LAST UPDATED · UTC</p>
                  <span>{lastUpdated || "Waiting for first signal…"}</span>
                </div>
              </div>

              <div className="connection-row">
                <span className={`connection-indicator ${error ? "offline" : ""}`} />
                {error
                  ? "Unable to retrieve latest data"
                  : "Telemetry refreshes every 5 seconds"}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* STATION POSITION / MAP */}
      <section id="tracking" className="page-section tracking-section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="02 / GEOSPATIAL DATA"
            title="Station position"
            number="02 — 03"
          />

          <div className="tracking-layout">
            <div className="tracking-copy">
              <div className="tracking-icon">
                <Compass size={29} strokeWidth={1.4} />
              </div>
              <p className="micro-label">CURRENT GROUND COORDINATES</p>
              <h3>Where is the station now?</h3>
              <p>
                Follow the International Space Station as it moves
                above Earth. The coordinates below update as new
                telemetry arrives.
              </p>

              <div className="coordinate-card">
                <div>
                  <span className="micro-label">LATITUDE</span>
                  <strong>{latitude}</strong>
                </div>
                <div>
                  <span className="micro-label">LONGITUDE</span>
                  <strong>{longitude}</strong>
                </div>
              </div>

              <a
                className="outline-button"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open interactive map <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="map-panel">
              <div className="map-topline">
                <span><MapPin size={14} /> STATION GROUND TRACK</span>
                <span className="map-live">
                  <span className="live-dot" /> LIVE POSITION
                </span>
              </div>

              <iframe
                key={iss ? `${Math.round(iss.latitude)}-${Math.round(iss.longitude)}` : "map"}
                title="Map showing the approximate current ISS position"
                src={
                  iss
                    ? `https://www.openstreetmap.org/export/embed.html?bbox=${iss.longitude - 20}%2C${iss.latitude - 12}%2C${iss.longitude + 20}%2C${iss.latitude + 12}&layer=mapnik&marker=${iss.latitude}%2C${iss.longitude}`
                    : "https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-60%2C180%2C80&layer=mapnik"
                }
                loading="lazy"
              />

              <div className="map-footer">
                <span>ISS-25544 / Approximate position</span>
                <a href={mapUrl} target="_blank" rel="noreferrer">
                  Expand map <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" className="page-section features-section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="03 / THE EXPERIENCE"
            title="Explore from a new perspective"
            number="03 — 03"
          />

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon"><Radio size={23} /></div>
              <p className="micro-label">01 / LIVE DATA</p>
              <h3>Real-time telemetry</h3>
              <p>
                Follow the station's altitude, speed and geographic
                position with regularly refreshed data.
              </p>
              <a href="#telemetry">Explore telemetry <ArrowRight size={14} /></a>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><Globe2 size={23} /></div>
              <p className="micro-label">02 / 3D VISUALIZATION</p>
              <h3>Earth in three dimensions</h3>
              <p>
                Explore the globe and see the station's current
                location represented in a spatial view.
              </p>
              <a href="#mission-control">Enter mission control <ArrowRight size={14} /></a>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><MapPin size={23} /></div>
              <p className="micro-label">03 / GLOBAL POSITION</p>
              <h3>Track across Earth</h3>
              <p>
                View the station's approximate ground position
                and open an interactive map for more detail.
              </p>
              <a href="#tracking">View station position <ArrowRight size={14} /></a>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><Zap size={23} /></div>
              <p className="micro-label">04 / ORBITAL SCIENCE</p>
              <h3>A closer look at orbit</h3>
              <p>
                Discover how a crewed research station circles
                our planet at extraordinary speed.
              </p>
              <a href="https://www.nasa.gov/international-space-station/" target="_blank" rel="noreferrer">
                Learn about the ISS <ArrowUpRight size={14} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <a href="#home" className="footer-brand">
          <Orbit size={22} /> ORBITAL
        </a>
        <p>Tracking humanity's orbital laboratory.</p>
        <div className="footer-status">
          <span className={`live-dot ${error ? "offline-dot" : ""}`} />
          {error ? "Awaiting connection" : "Refreshing every 5 seconds"}
        </div>
        <span className="footer-copy">ISS-25544 · Data via Where The ISS At</span>
      </footer>
    </main>
  );
}
