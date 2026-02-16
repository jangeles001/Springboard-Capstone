import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";
import Loading from "../../../../components/Loading";
import GraphCarousel from "./GraphCarousel";
import { MacroChart } from "./MacroChart";
import { MetricChart } from "./MetricChart";
import { buildIntensityComboChart } from "../../utils/buildIntensityChart";
import { buildTotalVolumeChart } from "../../utils/buildTotalVolumeChart";
import { buildWorkoutFrequencyChart } from "../../utils/buildWorkoutFrequencyChart"
import { buildDailyMacroChart } from "../../utils/buildDailyMacrosChart";
import { buildWeeklyMacroChart } from "../../utils/buildWeeklyMacrosChart";
import { buildMonthlyMacroChart } from "../../utils/buildMonthlyMacrosChart";
import { comboOptions, FrequencyOptions, volumeOptions } from "../../utils/metricChartOptions"

export function DashboardDisplayBody(){
    const { activeView, activeQuery } = useDashboardDisplayContext();

    if(activeQuery.isLoading) return <Loading  type="skeleton" />
    if(activeQuery.isError) return <>{console.log(activeQuery.error)}</>

  return (
    <div 
    className="mb-10"
    data-testid="dashboard-display-body"
    >
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeView === "nutrition"
              ? "Nutrition Trends"
              : "Workout Performance"}
          </h2>
        </div>

        {activeView === "nutrition" ? (
          <GraphCarousel interval={15000}>
            <MacroChart
            title="Daily Macros"
            data={buildDailyMacroChart(activeQuery?.data?.data?.daily ?? [])}
            nutritionGoals={activeQuery?.data?.data?.nutritionGoals ?? []}
            periodLength={1}
            type="bar"
            />
            <MacroChart
            title="Weekly Macros"
            data={buildWeeklyMacroChart(activeQuery?.data?.data?.weekly ?? [])}
            nutritionGoals={activeQuery?.data?.data?.nutritionGoals ?? []}
            periodLength={7}
            />
            <MacroChart
            title="Monthly Macros"
            data={buildMonthlyMacroChart(activeQuery?.data?.data?.monthly ?? [])}
            nutritionGoals={activeQuery?.data?.data?.nutritionGoals ?? []}
            periodLength={30}
            />
          </GraphCarousel>
          ) : (
          <GraphCarousel interval={15000}>
            <MetricChart
            title="Daily Frequency"
            type="bar"
            data={buildWorkoutFrequencyChart(activeQuery?.data?.data?.daily ?? [])}
            options={FrequencyOptions}
            />
            <MetricChart
            title="Weekly Total Volume"
            type="line"
            data={buildTotalVolumeChart(activeQuery?.data?.data?.weekly ?? [])}
            options={volumeOptions}
            />
            <MetricChart
            title="Weekly Intensity"
            type="combo"
            data={buildIntensityComboChart(activeQuery?.data?.data?.weekly ?? [])}
            options={comboOptions}
            />
          </GraphCarousel>
        )}
      </div>
    </div>
  );
}