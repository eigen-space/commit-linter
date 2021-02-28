export class Process {

    static exitWithSuccess(message: string): void {
        console.info(message);
        process.exit(0);
    }

    static exitWithError(message: string): void {
        console.error(message);
        process.exit(1);
    }
}