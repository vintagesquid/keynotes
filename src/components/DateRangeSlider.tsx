import { Component, createSignal, onCleanup, For, createMemo, Show, Switch, Match } from "solid-js";
import { RotateCcw, ChevronLeft, ChevronRight, Pencil } from "lucide-solid";
import "cally";
import {
  formatRangeLabel,
  getDefaultBounds,
  getDefaultRange,
  diffDays,
  addDays,
  snapToDay,
} from "~/lib/dates";

type QuickRange = {
  label: string;
  days: number;
};

const QUICK_RANGES: QuickRange[] = [
  { label: "1d", days: 1 },
  { label: "1w", days: 7 },
  { label: "4w", days: 28 },
];

const MIN_RANGE_MS = 24 * 60 * 60 * 1000;

type DateRangeSliderProps = {
  start: Date;
  end: Date;
  onRangeChange: (start: Date, end: Date) => void;
};

export const DateRangeSlider: Component<DateRangeSliderProps> = (props) => {
  const [start, setStart] = createSignal(props.start);
  const [end, setEnd] = createSignal(props.end);
  const initialBounds = getDefaultBounds(props.start, props.end);
  const [minBound, setMinBound] = createSignal(initialBounds.minBound);
  const [maxBound, setMaxBound] = createSignal(initialBounds.maxBound);
  const [dragState, setDragState] = createSignal<null | {
    type: "start" | "end" | "range";
    startPointerX: number;
    startLeft: Date;
    startRight: Date;
  }>(null);

  let trackRef: HTMLDivElement | undefined;

  const isSingleDay = createMemo(() => diffDays(start(), end()) <= 1);

  const rangeWidth = createMemo(() => {
    return maxBound().getTime() - minBound().getTime();
  });

  const startPct = createMemo(() => {
    if (rangeWidth() === 0) {
      return 0;
    }
    return ((start().getTime() - minBound().getTime()) / rangeWidth()) * 100;
  });

  const endPct = createMemo(() => {
    if (rangeWidth() === 0) {
      return 100;
    }
    return ((end().getTime() - minBound().getTime()) / rangeWidth()) * 100;
  });

  const todayPct = createMemo(() => {
    if (rangeWidth() === 0) {
      return -1;
    }
    const today = snapToDay(new Date());
    const pct = ((today.getTime() - minBound().getTime()) / rangeWidth()) * 100;
    return pct >= 0 && pct <= 100 ? pct : -1;
  });

  const activeQuick = createMemo(() => {
    const d = diffDays(start(), end());
    return QUICK_RANGES.find((r) => d === r.days)?.label ?? null;
  });

  const startText = createMemo(() => formatRangeLabel(start(), end()));
  const endText = createMemo(() => formatRangeLabel(end(), start()));
  const minText = createMemo(() => formatRangeLabel(minBound()));
  const maxText = createMemo(() => formatRangeLabel(maxBound()));
  const dayCount = createMemo(() => {
    const d = diffDays(start(), end());
    return d === 1 ? "1 day" : `${d} days`;
  });

  const commitRange = (s: Date, e: Date) => {
    setStart(s);
    setEnd(e);
    props.onRangeChange(s, e);
  };

  const applyQuick = (days: number) => {
    const newEnd = new Date(start().getTime() + days * MIN_RANGE_MS);
    commitRange(start(), newEnd);
  };

  const reset = () => {
    const def = getDefaultRange();
    const bounds = getDefaultBounds(def.start, def.end);
    setMinBound(bounds.minBound);
    setMaxBound(bounds.maxBound);
    commitRange(def.start, def.end);
  };

  const jumpToToday = () => {
    const rangeDuration = end().getTime() - start().getTime();
    const today = snapToDay(new Date());
    const newStart = new Date(today.getTime() - Math.floor(rangeDuration / 2));
    const newEnd = new Date(newStart.getTime() + rangeDuration);
    commitRange(newStart, newEnd);
  };

  const decreaseMin = () => {
    setMinBound(addDays(minBound(), -1));
  };

  const increaseMax = () => {
    setMaxBound(addDays(maxBound(), 1));
  };

  const onThumbDown = (type: "start" | "end") => (e: PointerEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.target.setPointerCapture(e.pointerId);
    setDragState({
      type,
      startPointerX: e.clientX,
      startLeft: start(),
      startRight: end(),
    });
  };

  const onRangeDown = (e: PointerEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.target.setPointerCapture(e.pointerId);
    setDragState({
      type: "range",
      startPointerX: e.clientX,
      startLeft: start(),
      startRight: end(),
    });
  };

  const handlePointerMove = (e: PointerEvent) => {
    const state = dragState();
    if (!state) {
      return;
    }

    const deltaX = e.clientX - state.startPointerX;
    if (!trackRef) {
      return;
    }
    const rect = trackRef.getBoundingClientRect();
    const msPerPixel = rangeWidth() / rect.width;
    const deltaMs = deltaX * msPerPixel;

    let newStart: Date;
    let newEnd: Date;

    if (state.type === "start") {
      newStart = new Date(state.startLeft.getTime() + deltaMs);
      newEnd = end();
      if (newStart.getTime() > newEnd.getTime()) {
        newStart = new Date(newEnd.getTime() - MIN_RANGE_MS);
      }
      if (newStart.getTime() < minBound().getTime()) {
        newStart = minBound();
      }
      if (isSingleDay()) {
        newEnd = new Date(newStart.getTime() + MIN_RANGE_MS);
      }
    } else if (state.type === "end") {
      newStart = start();
      newEnd = new Date(state.startRight.getTime() + deltaMs);
      if (isSingleDay()) {
        newStart = new Date(newEnd.getTime() - MIN_RANGE_MS);
        if (newEnd.getTime() < newStart.getTime()) {
          newEnd = new Date(newStart.getTime() + MIN_RANGE_MS);
        }
      }
      if (newEnd.getTime() < newStart.getTime()) {
        newEnd = new Date(newStart.getTime() + MIN_RANGE_MS);
      }
      if (newEnd.getTime() > maxBound().getTime()) {
        newEnd = maxBound();
      }
    } else {
      newStart = new Date(state.startLeft.getTime() + deltaMs);
      newEnd = new Date(state.startRight.getTime() + deltaMs);
      if (newStart.getTime() < minBound().getTime()) {
        const overshoot = minBound().getTime() - newStart.getTime();
        newStart = new Date(minBound().getTime());
        newEnd = new Date(newEnd.getTime() + overshoot);
      }
      if (newEnd.getTime() > maxBound().getTime()) {
        const overshoot = newEnd.getTime() - maxBound().getTime();
        newEnd = new Date(maxBound().getTime());
        newStart = new Date(newStart.getTime() - overshoot);
      }
    }

    newStart = snapToDay(newStart);
    newEnd = snapToDay(newEnd);

    setStart(newStart);
    setEnd(newEnd);
  };

  const handlePointerUp = (e: PointerEvent) => {
    const state = dragState();
    if (!state) {
      return;
    }
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.target.releasePointerCapture(e.pointerId);
    setDragState(null);
    props.onRangeChange(start(), end());
  };

  const onBoundDateChange = (bound: "min" | "max") => (e: Event) => {
    /*
     * e.currentTarget is the <calendar-date> web component which text-primary-content
     * a custom `value` string property not in the standard HTMLElement type
     */
    const target = e.currentTarget as HTMLElement & { value: string };
    const newDate = new Date(target.value);
    newDate.setHours(0, 0, 0, 0);
    if (bound === "min") {
      if (newDate.getTime() < end().getTime()) {
        setMinBound(newDate);
      }
    } else {
      if (newDate.getTime() > start().getTime()) {
        setMaxBound(newDate);
      }
    }
  };

  const boundPopoverId = (side: "min" | "max") => `date-range-bound-${side}`;

  onCleanup(() => {
    setDragState(null);
  });

  return (
    <div class="mx-auto w-full max-w-2xl rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm select-none">
      {/* quick ranges + reset */}
      <div class="mb-10 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <For each={QUICK_RANGES}>
            {(range) => (
              <button
                type="button"
                onClick={() => applyQuick(range.days)}
                aria-pressed={activeQuick() === range.label}
                classList={{
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring": true,
                  "border-primary bg-primary text-primary-content": activeQuick() === range.label,
                  "border-base-300 bg-base-100 text-base-content hover:bg-base-200 hover:text-base-content":
                    activeQuick() !== range.label,
                }}
              >
                {range.label}
              </button>
            )}
          </For>
        </div>

        <button
          type="button"
          onClick={reset}
          class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw class="size-3.5" />
          reset
        </button>
      </div>

      {/* slider row — arrows aligned with the track */}
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease minimum (extend range left)"
          onClick={decreaseMin}
          class="flex size-7 shrink-0 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft class="size-5" />
        </button>

        <div class="relative flex-1">
          {/* selected value labels above the thumb(s) */}
          <Switch fallback={
            <>
              <div
                class="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-base-content tabular-nums"
                style={{ left: `${startPct()}%` }}
              >
                {startText()}
              </div>
              <div
                class="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-base-content tabular-nums"
                style={{ left: `${endPct()}%` }}
              >
                {endText()}
              </div>
            </>
          }>
            <Match when={isSingleDay()}>
              <div
                class="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-base-content tabular-nums"
                style={{ left: `${startPct()}%` }}
              >
                {startText()}
              </div>
            </Match>
          </Switch>

          {/* track */}
          <div
            ref={trackRef}
            class="relative h-1.5 w-full rounded-full bg-base-200"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* selected fill (range mode only) — draggable to move the window */}
            <Show when={!isSingleDay()}>
              <button
                type="button"
                aria-label="Drag selected range"
                tabIndex={0}
                onPointerDown={onRangeDown}
                classList={{
                  "absolute top-1/2 z-10 h-4 -translate-y-1/2 rounded-[5px] bg-primary transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring": true,
                  "cursor-grabbing": dragState()?.type === "range",
                  "cursor-grab hover:brightness-110": dragState()?.type !== "range",
                }}
                style={{
                  left: `calc(${startPct()}% - 2px)`,
                  width: `calc(${endPct() - startPct()}% + 4px)`,
                }}
              />
            </Show>

            {/* today tick */}
            <Show when={todayPct() >= 0}>
              <button
                type="button"
                onClick={jumpToToday}
                class="absolute -top-2 z-10 -translate-x-1/2 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ left: `${todayPct()}%` }}
              >
                <div class="h-5 w-px bg-base-content/40" />
                <span class="absolute left-1/2 top-6 -translate-x-1/2 text-[10px] font-medium uppercase tracking-wide text-base-content/60">
                  today
                </span>
              </button>
            </Show>

            <Switch fallback={
              <>
                {/* start thumb */}
                <button
                  type="button"
                  role="slider"
                  aria-label="Range start"
                  aria-valuetext={startText()}
                  aria-valuemin={minBound().getTime()}
                  aria-valuemax={maxBound().getTime()}
                  aria-valuenow={start().getTime()}
                  onPointerDown={onThumbDown("start")}
                  onDblClick={() => commitRange(minBound(), end())}
                  classList={{
                    "absolute top-1/2 z-20 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[5px] border-2 border-primary bg-base-100 shadow-sm transition-transform hover:scale-110 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring": true,
                    "scale-110": dragState()?.type === "start",
                  }}
                  style={{ left: `${startPct()}%` }}
                />

                {/* end thumb */}
                <button
                  type="button"
                  role="slider"
                  aria-label="Range end"
                  aria-valuetext={endText()}
                  aria-valuemin={minBound().getTime()}
                  aria-valuemax={maxBound().getTime()}
                  aria-valuenow={end().getTime()}
                  onPointerDown={onThumbDown("end")}
                  onDblClick={() => commitRange(start(), maxBound())}
                  classList={{
                    "absolute top-1/2 z-20 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[5px] border-2 border-primary bg-base-100 shadow-sm transition-transform hover:scale-110 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring": true,
                    "scale-110": dragState()?.type === "end",
                  }}
                  style={{ left: `${endPct()}%` }}
                />
              </>
            }>
              <Match when={isSingleDay()}>
                {/* single movable point */}
                <button
                  type="button"
                  role="slider"
                  aria-label="Selected day"
                  aria-valuetext={startText()}
                  aria-valuemin={minBound().getTime()}
                  aria-valuemax={maxBound().getTime()}
                  aria-valuenow={start().getTime()}
                  onPointerDown={onThumbDown("start")}
                  onDblClick={() => commitRange(minBound(), end())}
                  classList={{
                    "absolute top-1/2 z-20 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[5px] border-2 border-primary bg-base-100 shadow-sm transition-transform hover:scale-110 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring": true,
                    "scale-110": dragState()?.type === "start",
                  }}
                  style={{ left: `${startPct()}%` }}
                />
              </Match>
            </Switch>
          </div>
        </div>

        <button
          type="button"
          aria-label="Increase maximum (extend range right)"
          onClick={increaseMax}
          class="flex size-7 shrink-0 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight class="size-5" />
        </button>
      </div>

      {/* min / max bound labels — aligned under the track */}
      <div class="mt-8 flex items-start justify-between px-10">
        <button
          type="button"
          aria-label="Edit minimum date"
          class="inline-flex items-center gap-1 text-sm text-base-content/60 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          popovertarget={boundPopoverId("min")}
          id={boundPopoverId("min") + "-btn"}
          style={`anchor-name:--${boundPopoverId("min")}`}
        >
          {minText()}
          <Pencil class="size-3" />
        </button>
        <button
          type="button"
          aria-label="Edit maximum date"
          class="inline-flex items-center gap-1 text-sm text-base-content/60 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          popovertarget={boundPopoverId("max")}
          id={boundPopoverId("max") + "-btn"}
          style={`anchor-name:--${boundPopoverId("max")}`}
        >
          {maxText()}
          <Pencil class="size-3" />
        </button>
      </div>

      {/* day count — bottom right */}
      <div class="mt-6 flex justify-end text-xs font-medium text-base-content/60 tabular-nums">
        {dayCount()}
      </div>

      <div
        popover
        id={boundPopoverId("min")}
        class="d-dropdown bg-base-100 rounded-box shadow-lg"
        style={`position-anchor:--${boundPopoverId("min")}`}
      >
        <calendar-date class="d-cally" onChange={onBoundDateChange("min")}>
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

      <div
        popover
        id={boundPopoverId("max")}
        class="d-dropdown bg-base-100 rounded-box shadow-lg"
        style={`position-anchor:--${boundPopoverId("max")}`}
      >
        <calendar-date class="d-cally" onChange={onBoundDateChange("max")}>
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
