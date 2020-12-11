import week from "./days.ts";
import ClassDB from "./classDB.ts";

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

const main = async () => {
  // First get today's date
  let today = new Date();

  // Compile our classes database
  const classDB = new ClassDB();
  await classDB.init();

  // Watch current class name
  let currentClassName: string;

  // Watch classes today
  const classesToday = classDB.getClassesToday(week.get(today.getDay()));

  const tick = () => {
    // Update date
    today = new Date();
    // Filter classes today to find one that matches current date and time
    const classrn = classesToday.filter((value) =>
      isInsideTime(value.start, value.end, today)
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
