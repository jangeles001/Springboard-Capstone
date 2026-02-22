import { DashboardDisplay } from "./DashboardDisplay/index"

export default function Dashboard(){
    return (
        <main 
        className="mx-auto min-w-[450px] max-w-7xl px-6 py-10"
        data-testid="dashboard-container"
        >
            <DashboardDisplay>
                <DashboardDisplay.Header />
                <DashboardDisplay.Body />
                <DashboardDisplay.Footer />
            </DashboardDisplay>
        </main>
    )
}