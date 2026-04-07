import { useZero } from "@rocicorp/zero/solid";
import { Component } from "solid-js";
import { mutators } from "~/zero/mutators";
import { Task } from "~/zero/schema";

type DeleteTaskButtonProps = {
  task: Task;
};

export const DeleteTaskButton: Component<DeleteTaskButtonProps> = (props) => {
  const zero = useZero();
  const onDeleteTaskButtonClick = () => {
    zero().mutate(mutators.tasks.delete({ id: props.task.id }));
  };

  return (
    <button class="btn btn-sm btn-ghost" onClick={onDeleteTaskButtonClick}>
      d
    </button>
  );
};
