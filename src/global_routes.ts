
const GLOBAL_ROUTES = {
  routes: [
    {
      url: "/languages",
      info: "Get a SVG for showing your top languages!",
      params: ["username", "color", "force"],
    },
    {
      url: "/contributions",
      info: "Get a SVG for showing your GitHub contributions!",
      params: ["username", "color", "force"],
    },
    {
      url: "/api/v1/stats/:username",
      info: "Get simple info from your GitHub profile",
    },
    {
      url: "/graphql",
      info: "Get advanced info from your GitHub profile",
    },
  ],
};

export default GLOBAL_ROUTES;