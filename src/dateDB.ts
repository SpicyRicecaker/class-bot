class DateDB {
  dateFile = "";

  date: Date = new Date();

  // Try to read file for date
  // constructor() {
  // this.init();
  // }

  init = async () => {
    this.dateFile = "date.json";
    try {
      this.date = new Date(
        JSON.parse(await Deno.readTextFile(this.dateFile)).date,
      );
    } catch (e) {
      // Make new date that isn't today
      this.date = new Date();
      this.date.setDate(this.date.getDate() - 1);
      this.writeSelf(JSON.stringify({ date: this.date }));
    }
  };

  getDate = () => this.date;

  writeSelf = async (dateObject: string) =>
    await Deno.writeTextFile(this.dateFile, dateObject);

  static isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default DateDB;
