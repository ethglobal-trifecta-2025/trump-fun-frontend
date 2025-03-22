"use client"

import * as React from "react"
import { ClassValue } from "clsx"
import { Circle, Dot, LucideIcon } from "lucide-react"
import { Bar, CartesianGrid, Legend, Line, LineChart } from "recharts"
import { 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Cell,
  BarChart,
  Label,
  LabelList
} from "recharts"
import { Legend as RechartsLegend, LegendProps } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
    icon?: LucideIcon
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  // Create CSS variables for the chart colors
  const style = React.useMemo(() => {
    if (!config) return {}

    return Object.entries(config).reduce(
      (acc, [key, value]) => {
        acc[`--color-${key}`] = value.color
        return acc
      },
      {} as Record<string, string>
    )
  }, [config])

  return (
    <div
      className={cn("w-full", className)}
      style={style}
      data-testid="chart-container"
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  className?: string
  labelKey?: string
  nameKey?: string
  indicator?: "dot" | "line" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  labelKey,
  nameKey,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const config = payload[0]?.payload?.config

  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
    >
      {!hideLabel && (
        <div className="flex items-center justify-between gap-8 border-b px-3 py-2">
          <span className="text-sm text-muted-foreground">
            {labelKey && config?.[labelKey]?.label ? config[labelKey].label : label}
          </span>
        </div>
      )}
      <div className="px-3 py-2">
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = item.dataKey
            const itemName = nameKey
              ? item.payload[nameKey]
              : config?.[key]?.label ?? key
            const color = item.color || `var(--color-${key})`

            return (
              <div key={index} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  {!hideIndicator && indicator === "dot" && (
                    <Circle fill={color} size={10} className="fill-current" />
                  )}
                  {!hideIndicator && indicator === "line" && (
                    <div className="size-4 w-10 border-t-2" style={{ borderColor: color }} />
                  )}
                  {!hideIndicator && indicator === "dashed" && (
                    <div
                      className="size-4 w-10 border-t-2 border-dashed"
                      style={{ borderColor: color }}
                    />
                  )}
                  <span className="text-sm font-medium">{itemName}</span>
                </div>
                <span className="font-mono text-right text-sm font-medium">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ChartTooltip(props: any) {
  return <Tooltip {...props} cursor={{ opacity: 0.25 }} />
}

interface ChartLegendProps extends Omit<LegendProps, "content"> {
  content?: React.ComponentType<any> | React.ReactElement
  className?: string
  nameKey?: string
}

export function ChartLegendContent({
  payload,
  className,
  nameKey,
}: {
  payload?: any[]
  className?: string
  nameKey?: string
}) {
  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}>
      {payload.map((entry: any, index: number) => {
        const key = entry.dataKey
        const config = entry.payload?.config
        const itemName = nameKey
          ? entry.payload[nameKey]
          : config?.[key]?.label ?? key
        const color = entry.color || `var(--color-${key})`

        return (
          <div key={index} className="flex items-center gap-2">
            <Dot
              strokeWidth={0}
              fill={color}
              className="size-3 fill-current"
            />
            <span className="text-sm font-medium">{itemName}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartLegend(props: ChartLegendProps) {
  return <RechartsLegend {...props} />
}

export function VolumeBarChart({ 
  data, 
  className 
}: { 
  data: any[] 
  className?: string
}) {
  return (
    <ChartContainer className={cn("h-[180px]", className)}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.slice(0, 10)}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="volume" 
          fill="var(--color-bar)"
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || "#ff6d00"} />
          ))}
          <LabelList dataKey="volume" position="top" formatter={(value: number) => `$${(value/1000).toFixed(0)}k`} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
} 