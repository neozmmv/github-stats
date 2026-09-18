
const GLOBAL_ROUTES = {
  routes: [
    {
      url: "/languages",
      info: "Get a SVG for showing your top languages! Optional width: 250 to 900.",
      params: ["username", "color", "force", "width"],
    },
    {
      url: "/contributions",
      info: "Get a SVG for showing your GitHub contributions! Optional width: 250 to 900.",
      params: ["username", "color", "force", "width"],
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