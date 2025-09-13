import * as DocumentPicker from "expo-document-picker";
import {
  cacheDirectory,
  documentDirectory,
  EncodingType,
  readAsStringAsync,
  writeAsStringAsync,
} from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { addMeasurement, Measurement } from "./database";

export const importMeasurements = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets) {
      console.log("Importação cancelada pelo usuário.");
      return;
    }

    const zipFileUri = result.assets[0].uri;

    const zipBase64 = await readAsStringAsync(zipFileUri, {
      encoding: EncodingType.Base64,
    });

    const zip = await JSZip.loadAsync(zipBase64, { base64: true });

    const metadataFile = zip.file("records.json");
    if (!metadataFile) {
      throw new Error(
        "Arquivo de backup inválido: records.json não encontrado."
      );
    }
    const metadataJson = await metadataFile.async("string");
    const recordsToImport = JSON.parse(metadataJson) as Measurement[];

    for (const record of recordsToImport) {
      const oldImageName = record.imageUri.split("/").pop();
      if (!oldImageName) continue;

      const imageFile = zip.file(oldImageName);
      if (!imageFile) {
        console.warn(
          `Imagem ${oldImageName} não encontrada no backup. Pulando.`
        );
        continue;
      }

      const imageBase64 = await imageFile.async("base64");

      const newFileName = `phia_image_${Date.now()}_${oldImageName}`;
      const newPermanentUri = documentDirectory + newFileName;
      await writeAsStringAsync(newPermanentUri, imageBase64, {
        encoding: EncodingType.Base64,
      });

      const newMeasurement: Measurement = {
        ...record,
        id: undefined,
        imageUri: newPermanentUri,
      };

      await addMeasurement(newMeasurement);
    }
  } catch (error) {
    console.error("Erro ao importar dados:", error);
  }
};

export const exportMeasurements = async (records: Measurement[]) => {
  if (!records || records.length === 0) {
    alert("Nenhum dado selecionado para exportar.");
    return;
  }

  try {
    const zip = new JSZip();

    const metadata = JSON.stringify(records, null, 2);
    zip.file("records.json", metadata);

    for (const record of records) {
      try {
        const imageContent = await readAsStringAsync(record.imageUri, {
          encoding: EncodingType.Base64,
        });

        const imageName = record.imageUri.split("/").pop();
        if (imageName) {
          zip.file(imageName, imageContent, { base64: true });
        }
      } catch (e) {
        console.warn(`Não foi possível ler a imagem: ${record.imageUri}`, e);
      }
    }

    const zipBase64 = await zip.generateAsync({ type: "base64" });

    const fileName =
      records.length > 1
        ? `phia_backup_todos_${Date.now()}.zip`
        : `phia_backup_${records[0].title.replace(
            /\s+/g,
            "_"
          )}_${Date.now()}.zip`;

    const zipFileUri = cacheDirectory + fileName;
    await writeAsStringAsync(zipFileUri, zipBase64, {
      encoding: EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(zipFileUri, {
        mimeType: "application/zip",
        dialogTitle: "Salvar backup de dados",
      });
    } else {
      alert("O compartilhamento não está disponível neste dispositivo.");
    }
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    alert("Ocorreu um erro ao criar o backup.");
  }
};
