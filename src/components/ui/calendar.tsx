/* eslint-disable */
"use client";

import { cn } from "@/lib/utils";
import { getLocalTimeZone, today } from "@internationalized/date";
import { ComponentProps } from "react";
import {
  Button,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
  composeRenderProps,
} from "react-aria-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface BaseCalendarProps {
  className?: string;
}

type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps;
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> & BaseCalendarProps;

const CalendarHeader = () => (
  <header className="flex w-full items-center gap-1 pb-4 px-1">
    <Button
      slot="previous"
      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
    <HeadingRac className="flex-1 text-center text-sm font-medium" />
    <Button
      slot="next"
      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
    >
      <ChevronRightIcon className="h-4 w-4" />
    </Button>
  </header>
);

const CalendarGridHeader = () => (
  <CalendarGridHeaderRac>
    {(day) => (
      <CalendarHeaderCellRac className="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground">
        {day}
      </CalendarHeaderCellRac>
    )}
  </CalendarGridHeaderRac>
);

const CalendarCell = ({ ...props }: ComponentProps<typeof CalendarCellRac>) => (
  <CalendarCellRac
    {...props}
    className={composeRenderProps(props.className, (className, renderProps) =>
      cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-sm outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
        renderProps.isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        renderProps.isOutsideMonth && "text-muted-foreground opacity-50",
        renderProps.isDisabled && "opacity-50",
        renderProps.isUnavailable && "text-destructive line-through",
        className
      )
    )}
  />
);

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <CalendarRac className={cn("p-3", className)} {...props}>
      <CalendarHeader />
      <CalendarGridRac className="w-full border-collapse space-y-1">
        <CalendarGridHeader />
        <CalendarGridBodyRac>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBodyRac>
      </CalendarGridRac>
    </CalendarRac>
  );
}

export function RangeCalendar({ className, ...props }: RangeCalendarProps) {
  return (
    <RangeCalendarRac className={cn("p-3", className)} {...props}>
      <CalendarHeader />
      <CalendarGridRac className="w-full border-collapse space-y-1">
        <CalendarGridHeader />
        <CalendarGridBodyRac>
          {(date) => (
            <CalendarCell
              date={date}
              className={composeRenderProps("", (className, renderProps) =>
                cn(
                  renderProps.isSelectionStart && "rounded-r-none bg-primary text-primary-foreground",
                  renderProps.isSelectionEnd && "rounded-l-none bg-primary text-primary-foreground",
                  renderProps.isSelected && !renderProps.isSelectionStart && !renderProps.isSelectionEnd && "rounded-none bg-accent text-accent-foreground",
                  className
                )
              )}
            />
          )}
        </CalendarGridBodyRac>
      </CalendarGridRac>
    </RangeCalendarRac>
  );
}

