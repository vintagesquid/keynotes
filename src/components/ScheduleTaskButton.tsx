import { useZero } from "@rocicorp/zero/solid";
import { Component } from "solid-js";
import { mutators } from "~/zero/mutators";
import { Task } from "~/zero/schema";

type ScheduleTaskButtonProps = {
  task: Task;
};

export const ScheduleTaskButton: Component<ScheduleTaskButtonProps> = (props) => {
  const zero = useZero();
  const onScheduleTaskClick = () => {
    zero().mutate(
      mutators.tasks.update({
        id: props.task.id,
        scheduledAt: Date.now(),
      }),
    );
  };

  return (
    <button class="btn btn-sm btn-ghost" onClick={onScheduleTaskClick}>
      r
    </button>
  );
};
