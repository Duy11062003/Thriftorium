const PublicRoute = ({ children, layout: Layout }) => {
  if (Layout) {
    return <Layout>{children}</Layout>;
  }

  return <>{children}</>;
};
export default PublicRoute;
