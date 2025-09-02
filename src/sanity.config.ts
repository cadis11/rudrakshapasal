import {defineConfig} from "sanity";
import {deskTool} from "sanity/desk";
import {visionTool} from "@sanity/vision";
import {schemaTypes} from "./sanity/schema";

export default defineConfig({
  name: "Rudraksha CMS",
  title: "Rudraksha-Pasal",
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  basePath: process.env.NEXT_PUBLIC_STUDIO_BASEPATH || "/admin",
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes },
})