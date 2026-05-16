import { Component, JSX, splitProps } from "solid-js";

type KeyboardHintButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: Component<{ class?: string }>;
  keyboardHintKey: string;
  onClick: () => void;
};

const KeyboardHintButton: Component<KeyboardHintButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, ["icon", "keyboardHintKey", "onClick"]);

  return (
    <button
      class="d-btn d-btn-sm d-btn-ghost d-btn-square group/keyboard-hint"
      onClick={local.onClick}
      {...buttonProps}
    >
      <span class="group-hover/keyboard-hint:hidden kbd">{local.keyboardHintKey}</span>
      <span class="hidden group-hover/keyboard-hint:block">
        <local.icon class="size-4" />
      </span>
    </button>
  );
};

export default KeyboardHintButton;
