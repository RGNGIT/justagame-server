import Users from "./users"
import Messenger from "./messenger";

export default function defineRoutes(router) {
  router.use(Users);
  router.use(Messenger);
}