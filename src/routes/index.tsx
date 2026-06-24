import { useQuery, useZero } from "@rocicorp/zero/solid";
import { TasksList } from "~/components/TaskList";
import { CreateTaskModal } from "~/components/CreateTaskModal";
import { DateRangeSlider } from "~/components/DateRangeSlider";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";
import { getDefaultRange } from "~/lib/dates";
import { v7 as uuid } from "uuid";
import { createSignal } from "solid-js";

export default function Home() {
  const zero = useZero();

  const defaultRange = getDefaultRange();
  const [rangeStart, setRangeStart] = createSignal(defaultRange.start.getTime());
  const [rangeEnd, setRangeEnd] = createSignal(defaultRange.end.getTime());

  const [tasks] = useQuery(() =>
    queries.tasks.scheduledBetween({ start: rangeStart(), end: rangeEnd() }),
  );

  const onRangeChange = (start: Date, end: Date) => {
    setRangeStart(start.getTime());
    setRangeEnd(end.getTime());
  };

  const onAddTaskClick = async () => {
    const result = zero().mutate(
      mutators.tasks.create({
        id: uuid(),
        title: "task-" + Number(Math.random() * 100).toFixed(),
        scheduledAt: Date.now(),
      }),
    );
    const clientResult = await result.client;

    if (!clientResult || clientResult.type === "error") {
      console.error("Failed to create task", clientResult?.error?.message);
      return;
    }
  };

  return (
    <div class="text-center mx-auto p-4 space-y-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">KeyNotes</h1>

      <DateRangeSlider
        start={defaultRange.start}
        end={defaultRange.end}
        onRangeChange={onRangeChange}
      />

      <h1 class="text-3xl">Tasks</h1>

      <div class="flex justify-center gap-2">
        <button class="d-btn d-btn-primary" onClick={onAddTaskClick}>
          Add random task to this day
        </button>
        <CreateTaskModal />
      </div>

      <div class="max-w-md mx-auto">
        <TasksList tasks={tasks()} />
      </div>
    </div>
  );
}
