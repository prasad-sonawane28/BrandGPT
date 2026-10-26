const PROFILE = {
  name: "Prasad",                                        // EDIT: add your full name
  role: "Full-stack web developer. B.Tech Computer Science student at Parul University, graduating 2027.",
  email: "your.email@example.com",                       // EDIT
  github: "https://github.com/your-username",            // EDIT
  linkedin: "https://www.linkedin.com/in/your-profile",  // EDIT
  education: "B.Tech, Computer Science Engineering, Parul University (2027)",
  certifications: ["AWS Cloud Foundations", "IBM AI Fundamentals"],
  experience: [
    "Android Development internship, 4Fox Solutions",
    "Deloitte Technology Virtual Internship",
  ],
  skills: ["Node.js", "Python", "MySQL", "HTML/CSS/JavaScript", "Next.js", "TypeScript", "FastAPI"],
};

function Profile() {
  const p = PROFILE;

  return (
    <div className="about">
      <div className="reveal">
        <p className="eyebrow">About the builder</p>
        <h2 className="name">{p.name}</h2>
        <p className="role">{p.role}</p>
        <div className="contact-links">
          <a className="btn btn-primary" href={`mailto:${p.email}`}>Email me</a>
          <a className="btn btn-ghost" href={p.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn btn-ghost" href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <p className="role" style={{ marginTop: "16px" }}>{p.email}</p>
      </div>

      <div className="reveal">
        <div className="cred">
          <h3>Education</h3>
          <ul><li>{p.education}</li></ul>
        </div>
        <div className="cred">
          <h3>Certifications</h3>
          <ul>{p.certifications.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <div className="cred">
          <h3>Experience</h3>
          <ul>{p.experience.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="cred">
          <h3>Skills</h3>
          <div className="skills">
            {p.skills.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;