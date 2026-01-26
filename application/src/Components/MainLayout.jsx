import { Outlet } from "react-router-dom";
import Navbar from "./Navabar";

export default function MainLayout({ setSearchQuery, searchQuery }) {
  return (
    <>
      <Navbar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      <Outlet />
    </>
  );
}
