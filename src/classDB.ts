/* eslint-disable */
// this file mostly serves just to find our links for class
// import filereader and path
import { studentClass } from "./types/types.ts";
import * as path from "https://deno.land/std/path/mod.ts";

// Holds the filepath and also eventuall class
class ClassDB {
  classFile = "";
  classes: studentClass[] = [];
  constructor() {
    this.classFile = path.join(Deno.cwd(), "src", "links.json");
  }
  init = async () => {
    try {
      this.classes = JSON.parse(await Deno.readTextFile(this.classFile));
    } catch (e) {
      console.log(e, "couldn't find file RIP");
      this.classes = [];
    }
  };
  getClasses = (): studentClass[] => this.classes;
  getClassesToday = (today: string): studentClass[] =>
    this.classes.filter((value) => value.schedule.includes(today));
}

export default ClassDB;
