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
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
            {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
            {stat.trend === "neutral" && <Minus className="h-4 w-4 text-gray-600" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
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
