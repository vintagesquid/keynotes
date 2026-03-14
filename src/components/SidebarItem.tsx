import { A } from "@solidjs/router";
import { Component } from "solid-js";

type SidebarItemProps = {
  icon: Component;
  label: string;
  href: string;
}

const SidebarItem: Component<SidebarItemProps> = (props) => {
  return (
    <li>
      <A href={props.href} class="flex flex-col items-center gap-1 py-2">
        <props.icon />
        <label class="text-xs">{props.label}</label>
      </A>
    </li>
  );
};

export default SidebarItem
