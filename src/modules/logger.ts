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
}

export default new log();
