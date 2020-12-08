// this file mostly serves just to find our links for class
// import filereader and path
import { studentClass } from "./types/types.d.ts";

const jsonPath = "info.json";

const readStudentClasses = async (
  filePath: string,
): Promise<studentClass[]> => JSON.parse(await Deno.readTextFile(filePath));

export default { jsonPath, readStudentClasses };
