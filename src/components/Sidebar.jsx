import { Link } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Providers", path: "/providers" },
    { name: "Disputes", path: "/disputes" }
  ];

  return (
    <aside className="w-60 bg-blue-50 h-screen shadow-md p-4">
      <ul>
        {links.map((link) => (
          <li key={link.name} className="mb-3">
            <Link to={link.path} className="text-gray-700 hover:text-blue-600 font-medium">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
