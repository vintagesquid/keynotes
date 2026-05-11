import { Component, JSX, splitProps } from "solid-js";

type KeyboardHintButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: unknown;
  keyboardHintKey: string;
  onClick: () => void;
};

const KeyboardHintButton: Component<KeyboardHintButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, ["icon", "keyboardHintKey", "onClick"]);

  return (
    <button
      class="btn btn-sm btn-ghost btn-square group/keyboard-hint"
      onClick={local.onClick}
      {...buttonProps}
    >
      <span class="group-hover/keyboard-hint:hidden kbd">{local.keyboardHintKey}</span>
      <span class="hidden group-hover/keyboard-hint:block">{"i"}</span>
    </button>
  );
};

export default KeyboardHintButton;
