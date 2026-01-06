import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";
import Loading from "../../../../components/Loading";
import GraphCarousel from "./GraphCarousel";
import { MacroChart } from "./MacroChart";
// import { CaloriesChart } from "./CaloriesChart";

export function DashboardDisplayBody(){
    const { activeView, activeQuery, workoutQuery, nutritionQuery, } = useDashboardDisplayContext();

      if(activeQuery.isLoading) return <Loading  type="skeleton" />
      if(activeQuery.isError) return <>{console.log(activeQuery.error)}</>

      console.log(workoutQuery);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl px-5">
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

            </GraphCarousel>
          }
      </div>
    </div>
  );
}