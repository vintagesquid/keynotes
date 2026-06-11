import { Component, createSignal } from "solid-js";
import { useZero } from "@rocicorp/zero/solid";
import { Plus } from "lucide-solid";
import { mutators } from "~/zero/mutators";
import { v7 as uuid } from "uuid";
import "cally";

export const CreateTaskModal: Component = () => {
  const zero = useZero();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(new Date().toISOString().slice(0, 10));
  let dialogRef: HTMLDialogElement | undefined;
  let formRef: HTMLFormElement | undefined;

  const openModal = () => dialogRef?.showModal();

  const closeModal = () => {
    formRef?.reset();
    dialogRef?.close();
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!formRef) return;

    setIsSubmitting(true);
    const formData = new FormData(formRef);
    const title = formData.get("title") as string;
    const scheduledAt = selectedDate();

    const result = zero().mutate(
      mutators.tasks.create({
        id: uuid(),
        title,
        scheduledAt: new Date(scheduledAt).getTime(),
      }),
    );
    const clientResult = await result.client;

    if (clientResult?.type === "error") {
      console.error("Failed to create task", clientResult.error?.message);
      setIsSubmitting(false);
      return;
    }

    closeModal();
    setIsSubmitting(false);
  };

  return (
    <>
      <button class="d-btn d-btn-primary" onClick={openModal}>
        <Plus class="size-4" />
      </button>
      <dialog class="d-modal" ref={dialogRef}>
        <div class="d-modal-box">
          <form ref={formRef} onSubmit={handleSubmit}>
            <h3 class="text-lg font-bold mb-4">Create Task</h3>
            <div class="space-y-4">
              <label class="d-label">
                <span>Title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  class="d-input d-input-bordered d-w-full"
                  required
                />
              </label>

              <label class="d-label">
                <span>Schedule Date</span>
                <calendar-date
                  class="d-cally border border-base-content rounded-box"
                  onChange={(e) => {
                    const target = e.currentTarget as HTMLElement & { value: string };
                    setSelectedDate(target.value);
                  }}
                >
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
              </label>
            </div>

            <div class="d-modal-action">
              <button type="button" class="d-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" class="d-btn d-btn-primary" disabled={isSubmitting()}>
                Create Task
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
