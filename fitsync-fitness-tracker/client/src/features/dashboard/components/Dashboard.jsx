import { DashboardDisplay } from "./DashboardDisplay/index"

export default function Dashboard(){
    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <DashboardDisplay>
                <DashboardDisplay.Header />
                <DashboardDisplay.Body />
                <DashboardDisplay.Footer />
            </DashboardDisplay>
        </div>
    )
}