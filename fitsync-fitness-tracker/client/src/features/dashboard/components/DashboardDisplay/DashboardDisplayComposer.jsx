import { DashboardDisplayContext } from "./DashboardDisplayContext"
import { useDashboard } from "../../hooks/useDashboard"

export function DashboardDisplayComposer({ children }){
    const dashboard = useDashboard();

    return (
        <DashboardDisplayContext.Provider value ={dashboard}>
            {children}
        </DashboardDisplayContext.Provider>
    )
}