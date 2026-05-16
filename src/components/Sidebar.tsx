import { Component } from "solid-js";
import { Square } from "lucide-solid";
import SidebarItem from "./SidebarItem";

const Sidebar: Component = () => {
  return (
    <aside class="min-h-screen w-16 items-center bg-base-200 flex flex-col justify-between py-4">
      <ul class="d-menu gap-2">
        <SidebarItem href="/" icon={() => <Square class="size-5" />} label="Stage" />
        <SidebarItem href="/revise" icon={() => <Square class="size-5" />} label="Revise" />
        <SidebarItem href="/stats" icon={() => <Square class="size-5" />} label="Stats" />
        <SidebarItem href="/goals" icon={() => <Square class="size-5" />} label="Goals" />
      </ul>
      <ul class="d-menu gap-2">
        <SidebarItem href="/settings" icon={() => <Square class="size-5" />} label="Settings" />
        <SidebarItem href="/profile" icon={() => <Square class="size-5" />} label="Profile" />
      </ul>
    </aside>
  );
};

export default Sidebar;
