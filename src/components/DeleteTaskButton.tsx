import { useZero } from "@rocicorp/zero/solid";
import { Component } from "solid-js";
import { Trash2 } from "lucide-solid";
import { mutators } from "~/zero/mutators";
import { Task } from "~/zero/schema";
import KeyboardHintButton from "./KeyboardHintButton";

type DeleteTaskButtonProps = {
  task: Task;
};

export const DeleteTaskButton: Component<DeleteTaskButtonProps> = (props) => {
  const zero = useZero();

  const onDeleteTaskButtonClick = () => {
    zero().mutate(mutators.tasks.delete({ id: props.task.id }));
  };

  return <KeyboardHintButton icon={Trash2} keyboardHintKey="d" onClick={onDeleteTaskButtonClick} />;
};
