import { DashboardDisplay } from "./DashboardDisplay/index"

export function Dashboard(){
    return (
        <DashboardDisplay>
            <DashboardDisplay.Header />
            <DashboardDisplay.Body />
        </DashboardDisplay>
    )
}