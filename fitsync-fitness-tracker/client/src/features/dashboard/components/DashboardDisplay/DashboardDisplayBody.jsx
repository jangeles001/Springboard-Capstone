import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";
import Graph from "./Graph";

export function DashboardDisplayBody(){
    const { data, isLoading, isError } = useDashboardDisplayContext();
    return (
        <div className="border py-10 px-10">
            <div className="border py-30 px-30">
                {/*<Graph type="line" data={data}></Graph>*/}
            </div>
        </div>
    )
}