// Shared frame for the register, verify and login pages.
import Pet from "../pet/components/Pet.jsx";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth">
      <div className="auth__panel">
        <Pet size={88} mood="idle" className="auth__pet" />
        <h1 className="auth__title">{title}</h1>
        {subtitle && <p className="auth__subtitle">{subtitle}</p>}
        {children}
      </div>
      {footer && <p className="auth__footer">{footer}</p>}
    </main>
  );
}
