import yargs from "yargs"
import {green,gray} from "./chalk"
import {debugArgsHandler as debug} from "./debug"
import {interactiveHandler} from "./interactiveHandler";
import {supportedOutputImages} from "./supportedFormats";

enum GroupOfOptions {
  IMAGE="Image Manipulation",
  VIDEO="Video Manipulation",
  MUSIC="Music Manipulation",
}
export const parsedArguments = () => {
  return yargs(process.argv.slice(2))
    .command(
      "interactive",
      "Use this command to use the interactive mode in order to manipulate your files.",
      async () => {
        const answers = await interactiveHandler();
        return answers
      },
      (argv) => {
        console.log("handler", argv);
      }
    )
    .option("files", {
      describe: "Selecting files to convert,optimize,or resize.",
      type: "string",
      alias: ["f"],
      array: true,
      group: GroupOfOptions.IMAGE,
      example:
        "$0 -f [files] -t [format] :ex. convit -f ./image1.png ./dir/image-2.jpeg  -t avif",
      coerce(files: string[]) {
        if (!files) {
          throw new Error(
            "Files option is required, please provide the files you intend to manipulate."
          );
        }
        debug(green("Files: "), files);
        return files;
      },
    })
    .option("convert-to", {
      describe: "Select the format you want to convert your file to.",
      type: "string",
      alias: ["t", "to"],
      choices: supportedOutputImages,
      group: GroupOfOptions.IMAGE,
      coerce(format: string) {
        if (!format) {
          throw new Error("Format is required, Please provide a format.");
        }
        if (!supportedOutputImages.includes(format)) {
          throw new Error(
            "Format is not valid please try again with a valid format. You can view valid image formats by seeing --help option."
          );
        }
        debug(green(`Format: ${gray(format)}`));
        return format;
      },
    })
    .option("size", {
      describe: "Specify the size of the images your want to manipulate.",
      type: "string",
      alias: ["s"],
      example: "$0 -f [files] -t [format] <--size, -s> [widthxheight]",
      group: GroupOfOptions.IMAGE,
      coerce(size: string) {
        const regex = /(\d+)x?(\d*)?/i;
        const parsedSize = size.match(regex);
        const sizeObj: { width?: number; height?: number } = {};
        if (parsedSize) {
          sizeObj.width = parsedSize[1] ? +parsedSize[1] : undefined;
          sizeObj.height = parsedSize[2] ? +parsedSize[2] : undefined;
          debug(green(`Size:  `), sizeObj);
          return sizeObj;
        }
      },
    })
    .help("help")
    .parseSync();

}
console.log(parsedArguments())




