import { useQuery, useZero } from "@rocicorp/zero/solid";
import { TasksList } from "~/components/TaskList";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";
import { v7 as uuid } from "uuid";

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(nextMonday.getDate() + 7);
  return { start: monday.getTime(), end: nextMonday.getTime() };
};

export default function Home() {
  const zero = useZero();
  const { start, end } = getWeekRange();
  const [tasks] = useQuery(() => queries.tasks.scheduledBetween({ start, end }));

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

      <h1 class="text-3xl">Tasks</h1>

      <button class="d-btn d-btn-primary" onClick={onAddTaskClick}>
        Add random task to this day
      </button>

      <div class="max-w-md mx-auto">
        <TasksList tasks={tasks()} />
      </div>
    </div>
  );
}
