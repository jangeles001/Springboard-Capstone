import { useMatches, Link } from "@tanstack/react-router";

export default function Breadcrumbs({ dynamicCrumb }) {
  const matches = useMatches();

  // Extract breadcrumb labels from staticData and creates object with label and to from match.pathname
  const crumbs = matches
    .filter((match) => match.staticData?.breadcrumb)
    .map((match) => ({
      label: match.staticData.breadcrumb,
      to: match.pathname,
    }));

  return (
    <nav className="text-sm mb-4 text-muted-foreground">
      {// Iterates through crumbs and builds the breadcrumb span with links until we reach our current page/dynamic crumb
        crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1 && !dynamicCrumb;
        return (
          <span key={crumb.to}>
            {!isLast ? (
              <>
                <Link to={crumb.to} className="text-blue-700">{crumb.label}</Link>
              </>
            ) : (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
      {dynamicCrumb && (
        <span className="font-medium text-foreground">
          {" / "}{dynamicCrumb}
        </span>
      )}
    </nav>
  );
}