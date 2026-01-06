import { DashboardDisplay } from "./DashboardDisplay/index"

export default function Dashboard(){
    return (
        <DashboardDisplay>
            <DashboardDisplay.Header />
            <DashboardDisplay.Body />
        </DashboardDisplay>
    )
}