import { Component } from "solid-js";
import SidebarItem from "./SidebarItem";

const PlaceholderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke-linejoin="round"
    stroke-linecap="round"
    stroke-width="2"
    fill="none"
    stroke="currentColor"
    class="size-5"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

const Sidebar: Component = () => {
  return (
    <aside class="min-h-screen w-16 items-center bg-base-200 flex flex-col justify-between py-4">
      <ul class="d-menu gap-2">
        <SidebarItem href="/" icon={PlaceholderIcon} label="Stage" />
        <SidebarItem href="/revise" icon={PlaceholderIcon} label="Revise" />
        <SidebarItem href="/stats" icon={PlaceholderIcon} label="Stats" />
        <SidebarItem href="/goals" icon={PlaceholderIcon} label="Goals" />
      </ul>
      <ul class="d-menu gap-2">
        <SidebarItem href="/settings" icon={PlaceholderIcon} label="Settings" />
        <SidebarItem href="/profile" icon={PlaceholderIcon} label="Profile" />
      </ul>
    </aside>
  );
};

export default Sidebar;
