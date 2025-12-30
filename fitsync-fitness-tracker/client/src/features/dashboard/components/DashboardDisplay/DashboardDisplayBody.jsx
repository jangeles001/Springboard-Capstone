import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";
import Loading from "../../../../components/Loading";
import GraphCarousel from "./GraphCarousel";
import { MacroChart } from "./MacroChart";
// import { CaloriesChart } from "./CaloriesChart";

export function DashboardDisplayBody(){
    const { data, isLoading, isError, error } = useDashboardDisplayContext();

      if(isLoading) return <Loading  type="skeleton" />
      if(isError) return <>{console.log(error)}</>

      console.log(data);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl px-5">
        <GraphCarousel interval={15000}>
            <MacroChart
            title="Daily Macros"
            logs={data.data.daily.mealLogs}
            nutritionGoals={data.data.nutritionGoals}
            periodLength={1}
            type="bar"
            />
            <MacroChart
            title="Weekly Macros"
            logs={data.data.weekly.mealLogs}
            nutritionGoals={data.data.nutritionGoals}
            periodLength={7}
            />
            <MacroChart
            title="Monthly Macros"
            logs={data.data.monthly.mealLogs}
            nutritionGoals={data.data.nutritionGoals}
            periodLength={30}
            />
        </GraphCarousel>
      </div>
    </div>
  );
}