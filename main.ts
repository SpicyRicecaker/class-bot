import week from "./days.ts";
import linker from "./links.ts";
import { studentClass } from "./types/types.d.ts";

const isSameDay = (a: Date, b: Date): boolean => (
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
);

// parse and compare minute hour string
// given hours and minutes of the form
const isInsideTime = (start: string, end: string, date: Date): boolean => {
  // Get start hour, start minutes, end hour, end minutes
  const s = [...start.split(":"), ...end.split(":")];
  const e = s.map((value) => parseInt(value, 10));
  // Get the amount of time in class by subtracting start by endtime
  const during = e[2] * 60 + e[3] -
    (e[0] * 60 + e[1]);
  // Gets the amount of time between now and the beginning of class
  const until = date.getHours() * 60 +
    date.getMinutes() -
    (e[0] * 60 + e[1]);
  // If the time between now and the beginning of class is greater than -6 (5 min early)
  // but less than the full length of the actual class, then this class is within time
  return until >= -Deno.args[1] && until <= during;
};

const openZoomLink = (process: string, link: string) => {
  Deno.run({
    cmd: [process, link],
  });
};

const openAllForms = (process: string, classes: studentClass[]) => {
  const command: string[] = [process];
  for (let i = 0; i < classes.length; ++i) {
    command.push(classes[i].form);
  }
  Deno.run({ cmd: command });
};

const main = async () => {
  let pastOpened: Date;
  // Try to read file for date
  try {
    pastOpened = new Date(JSON.parse(await Deno.readTextFile("date.json")).date);
  } catch (e) {
    // Make new date that isn't today
    pastOpened = new Date();
    pastOpened.setDate(pastOpened.getDate() - 1);
    await Deno.writeTextFile("date.json", JSON.stringify({ date: pastOpened }));
  }

  let date: Date = new Date();
  const day: string = week.get(date.getDay());

  // Get all classes from json
  const classesAll: studentClass[] = await linker.readStudentClasses(
    linker.jsonPath,
  );
  // Get classes today
  const classesToday = classesAll.filter((value) =>
    value.schedule.includes(day)
  );
  let currentClassName: string;

  // First open all attendance for classes today
  if (!isSameDay(pastOpened, date)) {
    openAllForms(Deno.args[0], classesToday);
    await Deno.writeTextFile("date.json", JSON.stringify({ date: date }));
  }

  const tick = () => {
    // Update date
    date = new Date();
    // If new day restart program
    if (week.get(date.getDay()) !== day) {
      return main();
    }
    // Filter classes today to find one that matches current date and time
    const classrn = classesToday.filter((value) =>
      isInsideTime(value.start, value.end, date)
    );
    // Open the zoom link for the class if there is one
    for (let i = 0; i < classrn.length; ++i) {
      if (classrn[i].name !== currentClassName) {
        openZoomLink(Deno.args[0], classrn[i].class);
        currentClassName = classrn[i].name;
      }
    }
    // Wait a min~
    setTimeout(tick, 60000);
  };
  tick();
};

main();
