import { useZero } from "@rocicorp/zero/solid";
import { Component } from "solid-js";
import { CalendarSearch } from "lucide-solid";
import { mutators } from "~/zero/mutators";
import { Task } from "~/zero/schema";
import KeyboardHintButton from "./KeyboardHintButton";
import "cally";
import { CalendarDateProps } from "cally";
type ScheduleTaskButtonProps = {
  task: Task;
};

export const ScheduleTaskButton: Component<ScheduleTaskButtonProps> = (props) => {
  const zero = useZero();
  const buttonId = `cally-${props.task.id}`;
  const popoverId = `cally-popover-${props.task.id}`;

  const onDateChange: CalendarDateProps["onChange"] = (e) => {
    const target = e.currentTarget as HTMLElement & { value: string };
    zero().mutate(
      mutators.tasks.update({
        id: props.task.id,
        scheduledAt: new Date(target.value).getTime(),
      }),
    );
  };

  return (
    <div>
      <KeyboardHintButton
        icon={CalendarSearch}
        keyboardHintKey="s"
        onClick={() => null}
        popovertarget={popoverId}
        id={buttonId}
        style={`anchor-name:--cally-${props.task.id}`}
      />
      <div
        popover
        id={popoverId}
        class="d-dropdown bg-base-100 rounded-box shadow-lg"
        style={`position-anchor:--cally-${props.task.id}`}
      >
        <calendar-date class="d-cally" onChange={onDateChange}>
          <svg
            aria-label="Previous"
            class="fill-current size-4"
            slot="previous"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
          </svg>
          <svg
            aria-label="Next"
            class="fill-current size-4"
            slot="next"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
          </svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
    </div>
  );
};
