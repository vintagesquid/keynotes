import { Component, For, createMemo } from "solid-js";
import { useZero } from "@rocicorp/zero/solid";
import { mutators } from "~/zero/mutators";
import type { Task } from "~/zero/schema";
import { ScheduleTaskButton } from "./ScheduleTaskButton";
import { DeleteTaskButton } from "./DeleteTaskButton";

type TasksListProps = {
  tasks: Task[];
};

export const TasksList: Component<TasksListProps> = (props) => {
  const zero = useZero();

  const handleToggle = (id: string, completed: boolean) => {
    zero().mutate(
      mutators.tasks.update({
        id,
        completedAt: completed ? Date.now() : null,
      }),
    );
  };

  const groupedTasksByScheduledDate = createMemo(() => {
    const groups: Record<string, Task[]> = {};
    const unscheduled: Task[] = [];

    for (const task of props.tasks) {
      if (task.scheduledAt) {
        const date = new Date(task.scheduledAt).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(task);
      } else {
        unscheduled.push(task);
      }
    }

    if (unscheduled.length > 0) {
      groups["To Be Scheduled"] = unscheduled;
    }

    return groups;
  });

  return (
    <div class="w-full">
      <For each={Object.entries(groupedTasksByScheduledDate())}>
        {([date, tasks]) => (
          <div class="space-y-4">
            <div>
              <h3 class="text-xl bg-red-50 text-base-100">{date}</h3>
            </div>
            <div class="space-y-1">
              <For each={tasks}>
                {(task) => (
                  <div class="flex gap-2 justify-between items-center group">
                    <div
                      classList={{
                        "line-through group-hover:no-underline": Boolean(task.completedAt),
                      }}
                    >
                      {task.title}
                    </div>
                    <div class="invisible group-hover:visible">
                      <div class="flex gap-2">
                        <div>
                          <input
                            type="checkbox"
                            class="checkbox"
                            checked={Boolean(task.completedAt)}
                            onChange={(e) => handleToggle(task.id, e.currentTarget.checked)}
                          />
                        </div>
                        <div>
                          <ScheduleTaskButton task={task} />
                        </div>
                        <div>
                          <DeleteTaskButton task={task} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
