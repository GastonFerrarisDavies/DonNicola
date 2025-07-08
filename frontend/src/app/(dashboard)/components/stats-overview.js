import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const stats = [
  {
    title: "Ventas del Mes",
    value: "€24,580",
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Productos Activos",
    value: "1,247",
    change: "+3.2%",
    trend: "up",
  },
  {
    title: "Clientes Totales",
    value: "892",
    change: "-2.1%",
    trend: "down",
  },
  {
    title: "Objetivos Cumplidos",
    value: "78%",
    change: "0%",
    trend: "neutral",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-quaternary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-quaternary/70">{stat.title}</CardTitle>
            {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-primary" />}
            {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-secondary" />}
            {stat.trend === "neutral" && <Minus className="h-4 w-4 text-quaternary/50" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quaternary">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.trend === "up" ? "text-primary" : stat.trend === "down" ? "text-secondary" : "text-quaternary/50"
              }`}
            >
              {stat.change} desde el mes pasado
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
