import * as FileSystem from "expo-file-system";
import JSZip from "jszip";

export async function unzip(zipPath: string, destinationDirectory: string) {
  try {
    const zipFileContents = await FileSystem.readAsStringAsync(zipPath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const zip = await JSZip.loadAsync(zipFileContents, {
      base64: true,
    });

    const unzippedDirectory = `${FileSystem.documentDirectory}${destinationDirectory}`;
    await FileSystem.makeDirectoryAsync(unzippedDirectory, {
      intermediates: true,
    });

    Object.keys(zip.files).map(async (filename) => {
      const fileData = await zip.files[filename].async("text");

      // Extract folder and file names from the path

      const fileParts = filename.split("/");
      const fileName = fileParts.pop();
      const folderPath = fileParts.join("/");
      const folderDirectory = `${unzippedDirectory}/${folderPath}`;
      // Create the directory if it doesn't exist

      await FileSystem.makeDirectoryAsync(folderDirectory, {
        intermediates: true,
      })
        .then(
          async () =>
            await FileSystem.writeAsStringAsync(
              `${folderDirectory}/${fileName}`,
              fileData
            )
        )
        .catch((e) => null);
    });

    return unzippedDirectory;
  } catch (error) {
    throw error;
  }
}
