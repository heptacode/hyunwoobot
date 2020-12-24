import chalk from "chalk";

class log {
  private getTsp(): string {
    return new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });
  }
  // Error
  public e(str: any): void {
    console.error(`[${this.getTsp()}] ${chalk.red(str)}`);
  }
  // Warning
  public w(str: any): void {
    console.log(`[${this.getTsp()}] ${chalk.yellow(str)}`);
  }
  // Info
  public i(str: any): void {
    console.log(`[${this.getTsp()}] ${chalk.cyan(str)}`);
  }
  // Success
  public s(str: any): void {
    console.log(`[${this.getTsp()}] ${chalk.green(str)}`);
  }
  // Verbose
  public v(str: any): void {
    console.log(`[${this.getTsp()}] ${chalk.white(str)}`);
  }
  // Debug
  public d(str: any): void {
    console.log(`[${this.getTsp()}] ${chalk.blue(str)}`);
  }
  // Custom
  public c(obj: object): void {
    let str = "";
    Object.keys(obj).forEach((key) => {
      if (key == "e") str += `${chalk.red(obj[key])} `;
      else if (key == "w") str += `${chalk.yellow(obj[key])} `;
      else if (key == "i") str += `${chalk.cyan(obj[key])} `;
      else if (key == "s") str += `${chalk.green(obj[key])} `;
      else if (key == "v") str += `${chalk.white(obj[key])} `;
      else if (key == "d") str += `${chalk.blue(obj[key])} `;
    });
    console.log(`[${this.getTsp()}] ${str}`);
  }
}

export default new log();
