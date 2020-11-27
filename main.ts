import week from "./days.ts";
import linker from "./links.ts";
import { studentClass } from "./types/types.d.ts";

// parse and compare minute hour string
// given hours and minutes of the form
const isInsideTime = (startTime: string, endTime: string, date: Date) => {
  // Get start hour, start minutes, end hour, end minutes
  const startStrs = [...startTime.split(":"), ...endTime.split(":")];
  const startNums = startStrs.map((value) => parseInt(value, 10));
  // let timeRange = {
  //   startHour: startNums[0],
  //   startMinutes: startNums[1],
  //   endHour: startNums[2],
  //   endMinutes: startNums[3],
  // };
  // Get the amount of time in class by subtracting start by endtime
  const classTime = startNums[2] * 60 + startNums[3] -
    (startNums[0] * 60 + startNums[1]);
  // Gets the amount of time between now and the beginning of class
  const currentDiff = date.getHours() * 60 +
    date.getMinutes() -
    (startNums[0] * 60 + startNums[1]);
  // If the time between now and the beginning of class is greater than -6 (5 min early)
  // but less than the full length of the actual class, then this class is within time
  return currentDiff >= -6 && currentDiff <= classTime;
};

// deno-lint-ignore no-explicit-any
const asyncTimeout = (callback: any, time: number) =>
  new Promise((resolve) => resolve(setTimeout(callback, time)));

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
  let date: Date = new Date();
  const day: string = week.get(date.getDay());

  // Get all classes from json
  const allClasses: studentClass[] = await linker.readStudentClasses(
    linker.jsonPath,
  );
  // Get classes today
  const classesToday = allClasses.filter((value) =>
    value.schedule.includes(day)
  );
  let currentClassName: string;

  // First open all attendance for classes today
  await openAllForms(Deno.args[0], classesToday);

  const loop = async () => {
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
        await openZoomLink(Deno.args[0], classrn[i].class);
        currentClassName = classrn[i].name;
      }
    }
    // Wait a min~
    return asyncTimeout(loop, 60000);
  };
  await loop();
};

main();
