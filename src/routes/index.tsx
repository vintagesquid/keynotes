import { useQuery, useZero } from "@rocicorp/zero/solid";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import Counter from "~/components/Counter";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";
import { v7 as uuid } from "uuid";

export default function Home() {
  const zero = useZero();
  console.log(zero().clientID);
  const [tasks] = useQuery(() => queries.tasks.getAllTasks());

  const onAddTaskClick = async () => {
    const result = zero().mutate(
      mutators.tasks.create({
        id: uuid(),
        title: "hey - " + Number(Math.random() * 100).toFixed(),
      }),
    );
    const clientResult = await result.client;

    if (!clientResult || clientResult.type === "error") {
      console.error("Failed to create task", clientResult?.error?.message);
      return;
    }

    console.log("Task created");
  };

  return (
    <div class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">KeyNotes</h1>

      <Counter />

      <h1 class="text-xl">Tasks</h1>

      <For each={tasks()}>
        {(task) => (
          <div>
            {task.id} - {task.title}
          </div>
        )}
      </For>

      <button class="btn btn-primary" onClick={onAddTaskClick}>
        Add random task
      </button>
      <p class="my-4">
        <span>Home</span>
      </p>
    </div>
  );
}
