import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";
import Loading from "../../../../components/Loading";
import GraphCarousel from "./GraphCarousel";
import { MacroChart } from "./MacroChart";
import { MetricChart } from "../MetricChart";
import { buildIntensityComboChart } from "../../utils/buildIntensityChart";
import { buildTotalVolumeChart } from "../../utils/buildTotalVolumeChart";
import { buildWorkoutFrequencyChart } from "../../utils/buildWorkoutFrequencyChart"
import { baseOptions, comboOptions } from "../../utils/metricChartOptions"

export function DashboardDisplayBody(){
    const { activeView, activeQuery } = useDashboardDisplayContext();

      if(activeQuery.isLoading) return <Loading  type="skeleton" />
      if(activeQuery.isError) return <>{console.log(activeQuery.error)}</>

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl mt-[50px]">
          { activeView === "nutrition" ? (
            <GraphCarousel interval={15000}>
              <MacroChart
              title="Daily Macros"
              logs={activeQuery.data.data.daily.mealLogs}
              nutritionGoals={activeQuery.data.data.nutritionGoals}
              periodLength={1}
              type="bar"
              />
              <MacroChart
              title="Weekly Macros"
              logs={activeQuery.data.data.weekly.mealLogs}
              nutritionGoals={activeQuery.data.data.nutritionGoals}
              periodLength={7}
              />
              <MacroChart
              title="Monthly Macros"
              logs={activeQuery.data.data.monthly.mealLogs}
              nutritionGoals={activeQuery.data.data.nutritionGoals}
              periodLength={30}
              />
            </GraphCarousel>) :
            <GraphCarousel interval={15000}>
              <MetricChart
              type="bar"
              data={buildWorkoutFrequencyChart(activeQuery.data.data.daily)}
              options={baseOptions}
              />
              <MetricChart
              type="line"
              data={buildTotalVolumeChart(activeQuery.data.data.weekly)}
              options={baseOptions}
              />
              <MetricChart
              type="combo"
              data={buildIntensityComboChart(activeQuery.data.data.weekly)}
              options={comboOptions}
              />
            </GraphCarousel>
          }
      </div>
    </div>
  );
}