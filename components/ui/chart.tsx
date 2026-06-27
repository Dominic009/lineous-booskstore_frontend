"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
    icon?: React.ComponentType;
  };
}

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children?: React.ReactNode;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartTooltip = (props: React.ComponentProps<"div">) => {
  return <div {...props} />;
};
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = (props: React.ComponentProps<"div">) => {
  return <div {...props} />;
};
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = (props: React.ComponentProps<"div">) => {
  return <div {...props} />;
};
ChartLegend.displayName = "ChartLegend";

const ChartLegendContent = (props: React.ComponentProps<"div">) => {
  return <div {...props} />;
};
ChartLegendContent.displayName = "ChartLegendContent";

const ChartStyle = (props: React.ComponentProps<"div">) => {
  return <div {...props} />;
};
ChartStyle.displayName = "ChartStyle";

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
