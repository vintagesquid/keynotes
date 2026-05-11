import type { CalendarRangeProps, CalendarMonthProps, CalendarDateProps } from "cally";
import type { JSX } from "solid-js";

type CalendarElement<T> = T & Omit<JSX.HTMLAttributes<HTMLElement>, keyof T>;

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-range": CalendarElement<CalendarRangeProps>;
      "calendar-month": CalendarElement<CalendarMonthProps>;
      "calendar-date": CalendarElement<CalendarDateProps>;
    }
  }
}
