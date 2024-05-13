import expressListEndpoints from "express-list-endpoints";
import { app } from "../index";
import { prettyEndpoints } from "./helper";

prettyEndpoints(expressListEndpoints(app));